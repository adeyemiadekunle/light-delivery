import { Body, Controller, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Authenticate a user and return session tokens' })
  @ApiCreatedResponse({ description: 'Access and refresh tokens returned' })
  @Post('login')
  login(@Body() input: LoginDto) {
    return this.authService.login(input);
  }
}
