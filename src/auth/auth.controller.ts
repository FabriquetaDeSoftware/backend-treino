import { Controller, Post, Body, Inject, UseGuards } from '@nestjs/common';
import { SignUpUseCase } from './use-cases/sign-up.use-case';
import { SignUpAuthDto } from './dto/sign-up-auth.dto';
import { Auth } from './entities/auth.entity';
import { SignInUseCase } from './use-cases/sign-in.use-case';
import { IsPublic } from 'src/decorators/is-public.decorator';
import { SignInAuthDto } from './dto/sign-in-auth.dto';
import { ITokensReturns } from './interfaces/tokens-returns.interface';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RefreshTokenUseCase } from './use-cases/refresh-token.use-case';
import { RefreshTokenAuthDto } from './dto/refresh-token-auth.dto';

@Controller('auth')
export class AuthController {
  @Inject()
  private signUpUseCase: SignUpUseCase;

  @Inject()
  private signInUseCase: SignInUseCase;

  @Inject()
  private refreshTokenUseCase: RefreshTokenUseCase;

  @IsPublic()
  @Post('signUp')
  async signUp(@Body() signUpAuthDto: SignUpAuthDto): Promise<Auth> {
    const result = await this.signUpUseCase.execute(signUpAuthDto);

    return result;
  }

  @IsPublic()
  @UseGuards(LocalAuthGuard)
  @Post('signIn')
  async signIn(@Body() signInAuthDto: SignInAuthDto): Promise<ITokensReturns> {
    const result = await this.signInUseCase.execute(signInAuthDto);

    return result;
  }

  @IsPublic()
  @Post('refreshToken')
  async refreshToken(
    @Body() { refresh_token }: RefreshTokenAuthDto,
  ): Promise<ITokensReturns> {
    const result = await this.refreshTokenUseCase.execute(refresh_token);

    return result;
  }
}
