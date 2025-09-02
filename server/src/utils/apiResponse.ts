import { Response } from 'express';

interface ApiResponseParams<T> {
  data?: T;
  message?: string;
  statusCode?: number;
  success?: boolean;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
}

export class ApiResponse<T = any> {
  constructor(
    private params: ApiResponseParams<T> = {},
    private status: number = 200
  ) {
    this.params = {
      success: true,
      statusCode: status,
      ...params
    };
  }

  public send(res: Response): Response {
    const response = {
      success: this.params.success,
      statusCode: this.status,
      message: this.params.message || 'Success',
      data: this.params.data || null,
      meta: this.params.meta
    };

    return res.status(this.status).json(response);
  }

  public static handleError(error: Error | any, res: Response): Response {
    console.error(error);

    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal Server Error';
    const name = error.name || 'InternalError';

    return res.status(statusCode).json({
      success: false,
      statusCode: statusCode,
      message: message,
      error: name,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }

  public static success<T>(data: T, res: Response, status: number = 200): Response {
    return new ApiResponse<T>({ data: data }, status).send(res);
  }

  public static error(
    message: string,
    res: Response,
    status: number = 400,
    error?: Error
  ): Response {
    return res.status(status).json({
      success: false,
      statusCode: status,
      message: message,
      error: error?.name || 'RequestError',
      stack: process.env.NODE_ENV === 'development' ? error?.stack : undefined
    });
  }

  public static paginate<T>(
    data: T,
    meta: { page: number; limit: number; total: number },
    res: Response,
    status: number = 200
  ): Response {
    return new ApiResponse<T>(
      {
        data: data,
        meta: {
          page: meta.page,
          limit: meta.limit,
          total: meta.total,
          pages: Math.ceil(meta.total / meta.limit)
        }
      },
      status
    ).send(res);
  }
}

export class ApiError extends Error {
  public statusCode: number;
  public details?: any;

  constructor(
    statusCode: number,
    message: string,
    details?: any
  ) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}