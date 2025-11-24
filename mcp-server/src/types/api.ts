/**
 * API Response Types for Checkmate MCP Server
 */

// Base API response structure
export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string | ApiErrorDetail;
  message?: string;
  status?: number;
  validationErrors?: ValidationError[];
}

export interface ApiErrorDetail {
  message: string;
  code?: string;
  details?: Record<string, unknown>;
}

export interface ValidationError {
  field: string;
  message: string;
  code?: string;
}

// Project types
export interface Project {
  projectId: number;
  projectName: string;
  projectDescription?: string;
  orgId: number;
  createdBy?: number;
  createdOn?: string;
  updatedOn?: string;
  updatedBy?: number;
  status: 'Active' | 'Archived' | 'Deleted';
  testsCount?: number;
  runsCount?: number;
}

// Test types
export interface Test {
  testId: number;
  testName: string;
  testDescription?: string;
  projectId: number;
  sectionId?: number;
  priorityId?: number;
  typeId?: number;
  platformId?: number;
  automationStatusId?: number;
  squadId?: number;
  testCoveredById?: number;
  labels?: number[];
  createdOn?: string;
  updatedOn?: string;
  createdBy?: number;
  updatedBy?: number;
}

// Run types
export interface Run {
  runId: number;
  runName: string;
  runDescription?: string;
  projectId: number;
  status: 'Active' | 'Locked' | 'Archived' | 'Deleted';
  createdOn?: string;
  updatedOn?: string;
  createdBy?: number;
  updatedBy?: number;
}

export interface RunStateDetail {
  runId: number;
  projectId: number;
  total: number;
  passed: number;
  failed: number;
  blocked: number;
  retest: number;
  skipped: number;
  untested: number;
  inProgress?: number;
}

export interface RunTestStatus {
  testId: number;
  runId: number;
  status: TestStatus;
  comment?: string;
  updatedBy?: number;
  updatedOn?: string;
}

export type TestStatus =
  | 'passed'
  | 'failed'
  | 'blocked'
  | 'retest'
  | 'skipped'
  | 'untested'
  | 'inProgress';

// Organization types
export interface Organization {
  orgId: number;
  orgName: string;
  createdOn?: string;
  updatedOn?: string;
}

// Metadata types
export interface Label {
  labelId: number;
  labelName: string;
  projectId: number;
}

export interface Section {
  sectionId: number;
  sectionName: string;
  sectionDescription?: string;
  projectId: number;
  parentSectionId?: number;
  depth?: number;
}

export interface Squad {
  squadId: number;
  squadName: string;
  projectId: number;
}

export interface Priority {
  priorityId: number;
  priorityName: string;
  orgId: number;
}

export interface Platform {
  platformId: number;
  platformName: string;
  orgId: number;
}

export interface TestType {
  typeId: number;
  typeName: string;
  orgId: number;
}

export interface AutomationStatus {
  automationStatusId: number;
  automationStatusName: string;
  orgId: number;
}

export interface TestCoveredBy {
  testCoveredById: number;
  testCoveredByName: string;
  orgId: number;
}

// User types
export interface User {
  userId: number;
  userName: string;
  email: string;
  role: 'admin' | 'user' | 'reader';
  orgId?: number;
  createdOn?: string;
  updatedOn?: string;
}

// Paginated response
export interface PaginatedResponse<T> {
  data: T[];
  page?: number;
  pageSize?: number;
  total?: number;
  hasMore?: boolean;
}

// Bulk operation response
export interface BulkOperationResponse {
  success: boolean;
  created?: number;
  updated?: number;
  deleted?: number;
  failed?: number;
  errors?: Array<{
    index: number;
    error: string;
  }>;
}
