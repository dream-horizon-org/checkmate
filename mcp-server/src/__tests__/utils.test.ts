import { 
  formatErrorResponse, 
  formatSuccessResponse, 
  buildQueryString, 
  validateResponse,
  sanitizeInput,
  handleApiResponse
} from '../tools/utils.js';

describe('Tool Utilities', () => {
  describe('formatErrorResponse', () => {
    it('should format error without details', () => {
      const result = formatErrorResponse('Something went wrong');
      expect(result.content[0].text).toBe('Something went wrong');
      expect(result.isError).toBe(true);
    });

    it('should format error with details', () => {
      const result = formatErrorResponse('Error occurred', { code: 500 });
      expect(result.content[0].text).toContain('Error occurred');
      expect(result.content[0].text).toContain('"code": 500');
      expect(result.isError).toBe(true);
    });
  });

  describe('formatSuccessResponse', () => {
    it('should format data without message', () => {
      const data = { id: 1, name: 'Test' };
      const result = formatSuccessResponse(data);
      expect(result.content[0].text).toBe(JSON.stringify(data, null, 2));
    });

    it('should format data with message', () => {
      const data = { id: 1 };
      const result = formatSuccessResponse(data, 'Success!');
      expect(result.content[0].text).toContain('Success!');
      expect(result.content[0].text).toContain('"id": 1');
    });
  });

  describe('buildQueryString', () => {
    it('should build query string from params', () => {
      const params = { page: 1, pageSize: 10, search: 'test' };
      const qs = buildQueryString(params);
      expect(qs).toContain('page=1');
      expect(qs).toContain('pageSize=10');
      expect(qs).toContain('search=test');
    });

    it('should skip undefined and null values', () => {
      const params = { page: 1, search: undefined, filter: null };
      const qs = buildQueryString(params);
      expect(qs).toBe('page=1');
    });

    it('should handle empty params', () => {
      const qs = buildQueryString({});
      expect(qs).toBe('');
    });
  });

  describe('validateResponse', () => {
    it('should validate valid responses', () => {
      expect(validateResponse({ data: 'value' })).toBe(true);
      expect(validateResponse([])).toBe(true);
      expect(validateResponse('')).toBe(true);
      expect(validateResponse(0)).toBe(true);
    });

    it('should reject null and undefined', () => {
      expect(validateResponse(null)).toBe(false);
      expect(validateResponse(undefined)).toBe(false);
    });
  });

  describe('sanitizeInput', () => {
    it('should escape HTML entities', () => {
      const input = '<script>alert("XSS")</script>';
      const sanitized = sanitizeInput(input);
      expect(sanitized).not.toContain('<script>');
      expect(sanitized).toContain('&lt;script&gt;');
    });

    it('should escape quotes and ampersands', () => {
      const input = 'Test "value" & \'more\'';
      const sanitized = sanitizeInput(input);
      expect(sanitized).toContain('&quot;');
      expect(sanitized).toContain('&amp;');
      expect(sanitized).toContain('&#x27;');
    });
  });

  describe('handleApiResponse', () => {
    it('should handle successful response', () => {
      const data = { success: true };
      const result = handleApiResponse(data);
      expect(result.isError).toBeUndefined();
      expect(result.content[0].text).toContain('success');
    });

    it('should handle null response with default error', () => {
      const result = handleApiResponse(null);
      expect(result.isError).toBe(true);
      expect(result.content[0].text).toBe('Failed to retrieve data');
    });

    it('should handle null response with custom error', () => {
      const result = handleApiResponse(null, 'Custom error message');
      expect(result.isError).toBe(true);
      expect(result.content[0].text).toBe('Custom error message');
    });
  });
});

