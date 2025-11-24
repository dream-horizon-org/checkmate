/**
 * Shared utilities for MCP tools
 */

import type { ApiResponse } from '../types/api.js';
import type { QueryParams } from '../types/mcp.js';
import type { TextContent, ImageContent, EmbeddedResource } from '@modelcontextprotocol/sdk/types.js';

// Type guard to safely check if value is an object
function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

// Type guard to check if value is ApiResponse
function isApiResponse(value: unknown): value is ApiResponse {
  return isObject(value);
}

type ToolContent = TextContent | ImageContent | EmbeddedResource;

export interface ToolResponse {
  content: ToolContent[];
  isError?: boolean;
  _meta?: Record<string, unknown>;
  [key: string]: unknown;
}

/**
 * Format error response for tools
 */
export function formatErrorResponse(message: string, details?: unknown): ToolResponse {
  const errorMessage = details 
    ? `${message}\n\nDetails: ${JSON.stringify(details, null, 2)}`
    : message;
  
  return {
    content: [{
      type: 'text',
      text: errorMessage,
    }],
    isError: true,
  };
}

/**
 * Format success response for tools
 */
export function formatSuccessResponse<T = unknown>(data: T, message?: string): ToolResponse {
  const text = message 
    ? `${message}\n\n${JSON.stringify(data, null, 2)}`
    : JSON.stringify(data, null, 2);
  
  return {
    content: [{
      type: 'text',
      text,
    }],
  };
}

/**
 * Build query string from parameters
 */
export function buildQueryString(params: QueryParams): string {
  const qs = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      qs.set(key, String(value));
    }
  });
  
  const queryString = qs.toString();
  return queryString ? `?${queryString}` : '';
}

/**
 * Validate response data
 */
export function validateResponse<T = unknown>(data: T | null | undefined): data is T {
  return data !== null && data !== undefined;
}

/**
 * Safe JSON parse with error handling
 */
export function safeJsonParse<T>(text: string, fallback: T): T {
  try {
    return JSON.parse(text) as T;
  } catch {
    return fallback;
  }
}

/**
 * Check if API response contains empty data
 */
export function isEmptyData(data: unknown): boolean {
  if (!data || !isApiResponse(data)) {
    return true;
  }
  if (data.data !== undefined) {
    const d = data.data;
    return !d || (Array.isArray(d) && d.length === 0) || (isObject(d) && Object.keys(d).every(k => d[k] === null));
  }
  return false;
}

/**
 * Create a "not found" error response
 */
export function formatNotFoundError(resourceType: string, identifier: string | number, helperTool?: string): ToolResponse {
  let message = `❌ ${resourceType} not found\n\n`;
  message += `${resourceType} ${identifier} does not exist or you don't have access to it.\n\n`;
  message += `💡 Solution:\n`;
  if (helperTool) {
    message += `- Use ${helperTool} to find valid ${resourceType.toLowerCase()}s\n`;
  }
  message += `- Verify the ${resourceType.toLowerCase()} ID is correct\n`;
  message += `- Ensure you have access to this resource\n`;
  
  return {
    content: [{
      type: 'text',
      text: message,
    }],
    isError: true,
  };
}

/**
 * Sanitize input to prevent injection attacks
 */
export function sanitizeInput(input: string): string {
  // Remove potentially dangerous characters
  return input.replace(/[<>"'&]/g, (char) => {
    const entities: Record<string, string> = {
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      '&': '&amp;',
    };
    return entities[char] || char;
  });
}

/**
 * Extract detailed error information from API response
 */
export function extractApiError(data: unknown): string {
  if (!data || !isApiResponse(data)) {
    return 'No response received from server';
  }
  
  // Check for error field in response
  if (data.error) {
    if (typeof data.error === 'string') {
      return data.error;
    }
    if (typeof data.error === 'object') {
      return JSON.stringify(data.error, null, 2);
    }
  }
  
  // Check for message field
  if (data.message) {
    return data.message;
  }
  
  // Check for validation errors
  if (data.validationErrors) {
    return `Validation errors:\n${JSON.stringify(data.validationErrors, null, 2)}`;
  }
  
  // Check for status-based errors
  if (typeof data.status === 'number' && data.status >= 400) {
    const statusMessages: Record<number, string> = {
      400: 'Bad Request - Invalid data provided',
      401: 'Unauthorized - Authentication required or invalid token',
      403: 'Forbidden - Insufficient permissions',
      404: 'Not Found - Resource does not exist',
      409: 'Conflict - Resource already exists or state conflict',
      422: 'Unprocessable Entity - Validation failed',
      423: 'Locked - Resource is locked and cannot be modified',
      500: 'Internal Server Error - Please try again',
      503: 'Service Unavailable - Server is temporarily unavailable',
    };
    
    const statusMessage = statusMessages[data.status] || `HTTP Error ${data.status}`;
    return data.error ? `${statusMessage}: ${typeof data.error === 'string' ? data.error : JSON.stringify(data.error)}` : statusMessage;
  }
  
  return 'Unknown error occurred';
}

/**
 * Format user-friendly error message with actionable guidance
 */
export function formatUserFriendlyError(
  operation: string,
  data: unknown,
  requiredFields?: string[]
): ToolResponse {
  const errorDetails = extractApiError(data);
  
  let message = `❌ Failed to ${operation}\n\n`;
  message += `Error: ${errorDetails}\n\n`;
  
  // Add guidance based on error type
  if (errorDetails.includes('Unauthorized') || errorDetails.includes('Authentication')) {
    message += `💡 Solution:\n`;
    message += `- Check that your API token is valid\n`;
    message += `- Verify the token has not expired\n`;
    message += `- Ensure you have the necessary permissions\n`;
  } else if (errorDetails.includes('validation') || errorDetails.includes('Required')) {
    message += `💡 Required Information:\n`;
    if (requiredFields && requiredFields.length > 0) {
      requiredFields.forEach(field => {
        message += `- ${field}\n`;
      });
    } else {
      message += `- Check the API documentation for required fields\n`;
    }
    message += `\nPlease provide all required fields and try again.\n`;
  } else if (errorDetails.includes('not found') || errorDetails.includes('Not Found')) {
    message += `💡 Solution:\n`;
    message += `- Verify the resource ID exists\n`;
    message += `- Check that you have access to this resource\n`;
    message += `- Ensure you're using the correct project/organization ID\n`;
  } else if (errorDetails.includes('Locked') || (isApiResponse(data) && data.status === 423)) {
    message += `💡 Solution:\n`;
    message += `- This resource is locked and cannot be modified\n`;
    message += `- Unlock the resource first before making changes\n`;
    message += `- Or work with an unlocked copy\n`;
  } else if (errorDetails.includes('Conflict') || (isApiResponse(data) && data.status === 409)) {
    message += `💡 Solution:\n`;
    message += `- Resource already exists with this name/identifier\n`;
    message += `- Choose a different name or update the existing resource\n`;
  }
  
  // Add response data if available for debugging
  if (isObject(data) && Object.keys(data).length > 0) {
    message += `\n📋 Response Data:\n`;
    message += `${JSON.stringify(data, null, 2)}\n`;
  }
  
  return {
    content: [{
      type: 'text',
      text: message,
    }],
    isError: true,
  };
}

/**
 * Handle API response and format for MCP with enhanced error details
 */
export function handleApiResponse(
  data: unknown,
  operation: string = 'complete operation',
  requiredFields?: string[]
): ToolResponse {
  // Check if response indicates an error
  if (!validateResponse(data)) {
    return formatUserFriendlyError(operation, { error: 'No response from server' }, requiredFields);
  }
  
  // Check for error status codes
  if (isApiResponse(data) && ((data.status !== undefined && data.status >= 400) || data.error)) {
    return formatUserFriendlyError(operation, data, requiredFields);
  }
  
  // Success response
  let message = `✅ Successfully completed: ${operation}\n\n`;
  message += `${JSON.stringify(data, null, 2)}`;
  
  return {
    content: [{
      type: 'text',
      text: message,
    }],
  };
}

