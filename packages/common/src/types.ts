import { z } from 'zod';

// Common types used across the application
export interface BaseResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
}

export interface PaginationResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Analysis related types
export interface AnalysisRequest {
  message: string;
  source: 'discord' | 'slack' | 'api';
  userId: string | undefined;
  channelId: string | undefined;
}

export interface AnalysisResult {
  id: string;
  message: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  confidence: number;
  reasoning?: string;
  emotions?: string[];
  keywords?: string[];
  source: 'discord' | 'slack' | 'api';
  userId?: string;
  channelId?: string;
  createdAt: Date;
}

// Bot command types
export interface BotCommand {
  name: string;
  description: string;
  execute: (interaction: any) => Promise<void>;
}

// Error types
export class EchoSphereError extends Error {
  public readonly code: string;
  public readonly statusCode: number;

  constructor(message: string, code: string, statusCode: number = 500) {
    super(message);
    this.name = 'EchoSphereError';
    this.code = code;
    this.statusCode = statusCode;
  }
}

export class ValidationError extends EchoSphereError {
  constructor(message: string) {
    super(message, 'VALIDATION_ERROR', 400);
  }
}

export class NotFoundError extends EchoSphereError {
  constructor(message: string) {
    super(message, 'NOT_FOUND', 404);
  }
}

export class InternalServerError extends EchoSphereError {
  constructor(message: string) {
    super(message, 'INTERNAL_SERVER_ERROR', 500);
  }
}

export const BaseResponseSchema = z.object({
  success: z.boolean(),
  data: z.any().optional(),
  error: z.string().optional(),
  message: z.string().optional(),
});

export const PaginationParamsSchema = z.object({
  page: z.number().optional(),
  limit: z.number().optional(),
  offset: z.number().optional(),
});

export const PaginationResultSchema = z.object({
  items: z.array(z.any()),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number(),
});

export const AnalysisRequestSchema = z.object({
  message: z.string().min(1),
  source: z.enum(['discord', 'slack', 'api']),
  userId: z.string().optional(),
  channelId: z.string().optional(),
});

export const AnalysisResultSchema = z.object({
  id: z.string(),
  message: z.string().min(1),
  sentiment: z.enum(['positive', 'negative', 'neutral']),
  confidence: z.number().min(0).max(1),
  reasoning: z.string().optional(),
  emotions: z.array(z.string()).optional(),
  keywords: z.array(z.string()).optional(),
  source: z.enum(['discord', 'slack', 'api']),
  userId: z.string().optional(),
  channelId: z.string().optional(),
});
