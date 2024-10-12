import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthRepository } from './repository/auth.repository';
import { HashUtils } from 'src/utils/hash.utils';
import { SignUpUseCase } from './use-cases/sign-up.use-case';
import { SignInUseCase } from './use-cases/sign-in.use-case';
import { LocalStrategy } from './strategies/local.strategy';
import { PassportModule } from '@nestjs/passport';
import { GenerateTokenHelper } from './helpers/ generate-token.helper';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants/constants';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { UserValidatorProvider } from './providers/user-validator.provider';
import { FindUserEmailHelper } from './helpers/find-user-email.helper';
import { RefreshTokenUseCase } from './use-cases/refresh-token.use-case';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret_token_key,
      signOptions: { expiresIn: '5m' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    SignInUseCase,
    GenerateTokenHelper,
    SignUpUseCase,
    HashUtils,
    LocalStrategy,
    JwtStrategy,
    AuthRepository,
    UserValidatorProvider,
    FindUserEmailHelper,
    RefreshTokenUseCase,
    {
      provide: 'IAuthRepository',
      useExisting: AuthRepository,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AuthModule {}
