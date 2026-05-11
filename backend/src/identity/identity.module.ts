import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ScopedPublicIdGuard } from './guards/scoped-public-id.guard';
import { MeController } from './me.controller';
import { MeService } from './me.service';
import { PasswordService } from './password.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_ACCESS_SECRET ?? 'development-access-secret',
        signOptions: { expiresIn: '15m' },
      }),
    }),
  ],
  controllers: [AuthController, MeController],
  providers: [AuthService, PasswordService, MeService, JwtAuthGuard, ScopedPublicIdGuard],
  exports: [JwtModule, PasswordService, AuthService, JwtAuthGuard, ScopedPublicIdGuard],
})
export class IdentityModule {}
