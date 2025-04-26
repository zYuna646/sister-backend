import {
  Controller,
  Post,
  Request,
  UseGuards,
  Body,
  Get,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { LoginBody, LoginResponseDto } from './dto/auth-dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  @ApiOperation({ summary: 'Login and get JWT token' })
  @ApiResponse({
    status: 200,
    description: 'Successfully logged in. Returns a JWT token.',
    type: LoginResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Invalid credentials.',
  })
  async login(@Body() loginBody: LoginBody, @Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('validate')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Validate JWT token and get user data' })
  @ApiResponse({
    status: 200,
    description: 'Returns user data for the authenticated user',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Invalid or expired JWT token.',
  })
  async validate(@Request() req) {
    return this.authService.getUserById(req.user.userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get authenticated user profile' })
  @ApiResponse({
    status: 200,
    description: 'Returns the authenticated user profile',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Invalid or expired JWT token.',
  })
  async getProfile(@Request() req) {
    return this.authService.getUserById(req.user.userId);
  }
}
