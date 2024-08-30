import { JwtService } from '@nestjs/jwt';

export class JwtUtils {
  private static jwtService = new JwtService({
    secret: process.env.JWT_SECRET || 'your_default_secret',
    signOptions: { expiresIn: process.env.JWT_EXPIRY },
  });

  /**
   * Decode a JWT token without verifying its signature.
   * @param token The JWT token to decode.
   * @returns The decoded token payload or null if decoding fails.
   */
  static decodeToken(token: string): any {
    try {
      return this.jwtService.decode(token);
    } catch (error) {
      console.error('Failed to decode token:', error);
      return null;
    }
  }

  /**
   * Verify and decode a JWT token.
   * @param token The JWT token to verify and decode.
   * @returns The decoded token payload or null if verification fails.
   */
  static verifyToken(token: string): any {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      console.error('Failed to verify token:', error);
      return null;
    }
  }
}
