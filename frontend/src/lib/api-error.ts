export interface ApiErrorResponse {
  error: string;
  message: string;
  retryAfter?: number;
  statusCode?: number;
}

export class ApiError extends Error {
  public statusCode: number;
  public error: string;
  public retryAfter?: number;
  public isRateLimit: boolean;
  public isAuth: boolean;
  public isCors: boolean;
  public isUpload: boolean;

  constructor(response: Response, errorData: ApiErrorResponse) {
    super(errorData.message || errorData.error || `HTTP ${response.status}`);

    this.name = 'ApiError';
    this.statusCode = response.status;
    this.error = errorData.error || 'Unknown error';
    this.retryAfter = errorData.retryAfter;

    // Categorize error types for better UI handling
    this.isRateLimit = response.status === 429;
    this.isAuth = response.status === 401 || response.status === 403;
    this.isCors =
      response.status === 0 ||
      (response.status >= 400 && this.error.includes('CORS'));
    this.isUpload =
      response.status === 413 ||
      this.error.includes('upload') ||
      this.error.includes('file');
  }

  getUserFriendlyMessage(): string {
    if (this.isRateLimit) {
      if (this.error.includes('authentication')) {
        return `Too many login attempts. Please wait ${this.retryAfter ? Math.ceil(this.retryAfter / 60) : 10} minutes before trying again.`;
      }
      return `You're making requests too quickly. Please wait ${this.retryAfter || 60} seconds and try again.`;
    }

    if (this.isAuth) {
      if (this.statusCode === 401) {
        return 'Authentication failed. Please check your credentials and try again.';
      }
      return "You don't have permission to perform this action.";
    }

    if (this.isUpload) {
      if (this.statusCode === 413) {
        return "The file you're trying to upload is too large. Please choose a smaller file.";
      }
      if (this.message.includes('file type')) {
        return "The file type you're trying to upload is not allowed. Please choose a different file.";
      }
      return 'There was a problem uploading your file. Please try again.';
    }

    if (this.isCors) {
      return 'Connection error. Please check your internet connection and try again.';
    }

    // Default to the original message for other errors
    return this.message;
  }

  getRetryDelay(): number {
    return this.retryAfter ? this.retryAfter * 1000 : 0;
  }
}
