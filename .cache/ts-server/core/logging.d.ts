import { Request, Response } from "express";
/**
 * Low overhead Node.js logger.
 *
 * @see https://github.com/pinojs/pino
 */
export declare const logger: import("pino").Logger<never>;
/**
 * Creates a request-based logger with trace ID field for logging correlation.
 *
 * @see https://cloud.google.com/run/docs/logging#correlate-logs
 */
export declare const loggerMiddleware: import("pino-http").HttpLogger<Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>, Response<any, Record<string, any>>, never>;
