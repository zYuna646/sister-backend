import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { School } from '../schemas/school.schema';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class ApiKeyMiddleware implements NestMiddleware {
  constructor(
    @InjectModel('School') private schoolModel: Model<School>,
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      // Get the API key from headers
      const apiKey = req.headers['x-api-key'] as string;

      // Extract and verify JWT token if present
      const authHeader = req.headers.authorization;
      const token = authHeader?.split(' ')[1];

      let role = null;
      let userId = null;

      if (token) {
        try {
          // Decode the JWT token
          const decoded = this.jwtService.verify(token);
          role = decoded.role;
          userId = decoded.sub;

          // If user is superadmin, allow access without API key
          if (role === 'superadmin') {
            return next();
          }

          // Check if user has wildcard permission [*]
          if (userId) {
            const userResponse = await this.userService.findById(userId);
            const user = userResponse.data;

            if (user && user.role) {
              // If role has permissions field with [*], exempt from API key and filtering
              if (
                user.role.permissions &&
                user.role.permissions.includes('*')
              ) {
                return next();
              }
            }
          }
        } catch (error) {
          // Invalid token, continue to API key check
        }
      }

      // If no API key provided, reject the request
      if (!apiKey) {
        throw new UnauthorizedException('API key is required in headers');
      }

      // Find the school with the provided API key
      const school = await this.schoolModel.findOne({ api_key: apiKey });

      if (!school) {
        throw new UnauthorizedException('Invalid API key');
      }

      // Attach the school info to the request for use in controllers
      req['school'] = school;

      // If a valid school is found, add school filter to query params
      // This will be used by controllers to filter data by school_id
      if (!req.query) {
        req.query = {};
      }

      // Add school_id to query parameters to filter data
      req.query.school_id = school._id.toString();

      next();
    } catch (error) {
      next(error);
    }
  }
}
