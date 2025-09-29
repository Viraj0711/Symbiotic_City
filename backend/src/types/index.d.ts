// Type declarations for modules without built-in TypeScript support

declare module 'helmet' {
  import { RequestHandler } from 'express';
  
  interface HelmetOptions {
    contentSecurityPolicy?: any;
    crossOriginEmbedderPolicy?: boolean;
    [key: string]: any;
  }
  
  function helmet(options?: HelmetOptions): RequestHandler;
  export = helmet;
}

declare module 'cors' {
  import { RequestHandler } from 'express';
  
  interface CorsOptions {
    origin?: string | string[] | boolean;
    credentials?: boolean;
    methods?: string | string[];
    allowedHeaders?: string | string[];
    [key: string]: any;
  }
  
  function cors(options?: CorsOptions): RequestHandler;
  export = cors;
}

declare module 'compression' {
  import { RequestHandler } from 'express';
  function compression(): RequestHandler;
  export = compression;
}

declare module 'morgan' {
  import { RequestHandler } from 'express';
  
  interface StreamOptions {
    write: (message: string) => void;
  }
  
  function morgan(format: string, options?: { stream?: StreamOptions }): RequestHandler;
  export = morgan;
}

declare module 'express-rate-limit' {
  import { RequestHandler } from 'express';
  
  interface RateLimitOptions {
    windowMs?: number;
    max?: number;
    message?: any;
    standardHeaders?: boolean;
    legacyHeaders?: boolean;
    [key: string]: any;
  }
  
  function rateLimit(options?: RateLimitOptions): RequestHandler;
  export = rateLimit;
}

declare module 'jsonwebtoken' {
  export function sign(payload: any, secret: string, options?: any): string;
  export function verify(token: string, secret: string): any;
  export function decode(token: string): any;
}

declare module 'bcryptjs' {
  export function hash(data: string, rounds: number): Promise<string>;
  export function compare(data: string, encrypted: string): Promise<boolean>;
}

declare module 'multer' {
  import { RequestHandler } from 'express';
  
  interface MulterOptions {
    dest?: string;
    limits?: {
      fileSize?: number;
    };
    [key: string]: any;
  }
  
  function multer(options?: MulterOptions): {
    single(field: string): RequestHandler;
    array(field: string): RequestHandler;
    fields(fields: any[]): RequestHandler;
  };
  
  export = multer;
}

declare module 'sharp' {
  function sharp(input?: any): any;
  export = sharp;
}

declare module 'nodemailer' {
  export function createTransporter(options: any): any;
  export const createTransport: (options: any) => any;
}

declare module 'winston' {
  export interface Logger {
    error(message: string, meta?: any): void;
    warn(message: string, meta?: any): void;
    info(message: string, meta?: any): void;
    debug(message: string, meta?: any): void;
  }
  
  export const format: {
    combine(...args: any[]): any;
    timestamp(): any;
    errors(options: any): any;
    json(): any;
    colorize(): any;
    simple(): any;
  };
  
  export const transports: {
    File: new (options: any) => any;
    Console: new (options: any) => any;
  };
  
  export function createLogger(options: any): Logger;
}

declare module 'express-validator' {
  export function body(field: string): any;
  export function param(field: string): any;
  export function query(field: string): any;
  export function validationResult(req: any): any;
}
