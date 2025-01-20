import { Request, Response, NextFunction } from 'express';
import { logger } from '../../utils/logger';

export const apiMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();
    // Log the incoming request with headers and body
    logger.info(`Incoming request: ${req.method} ${req.url}`, {
        headers: req.headers,
        body: JSON.stringify(req.body)
    });

    // Capture the original res.json function
    const originalJson = res.json;

    // Override the res.json function
    res.json = function (body) {
        const duration = Date.now() - start;
        
        // Log the outgoing response with body
        logger.info(`Outgoing response: ${req.method} ${req.url} - Status: ${res.statusCode} - Duration: ${duration}ms`, {
            requestBody: JSON.stringify(req.body),
            responseBody: JSON.stringify(body)
        });

        // Call the original json function
        return originalJson.call(this, body);
    };

    // Add 'finish' event listener to capture non-JSON responses
    res.on('finish', () => {
        if (!res.headersSent) {
            const duration = Date.now() - start;
            logger.info(`Outgoing response: ${req.method} ${req.url} - Status: ${res.statusCode} - Duration: ${duration}ms`);
        }
    });

    next();
};