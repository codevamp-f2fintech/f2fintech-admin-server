import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class CompanyMiddleware implements NestMiddleware {
    use ( req: Request, res: Response, next: NextFunction ) {
        // Extract company ID from header, subdomain, or JWT token
        const companyId = req.headers[ 'Companyid' ] ||
            req.headers[ 'company-id' ] ||
            // Extract from subdomain or JWT
            null;

        // Add company context to request
        req[ 'company' ] = { id: companyId };
        next();
    }
}