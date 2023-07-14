export type ApiResponse<T> =
  | { status: 'success'; data: T; timestamp: Date }
  | { status: 'error'; message: string; timestamp: Date };

export const ApiSuccess = <T>(data: T): ApiResponse<T> => ({
  status: 'success',
  data,
  timestamp: new Date(),
});

export const ApiError = (message: string): ApiResponse<null> => ({
  status: 'error',
  message,
  timestamp: new Date(),
});
