import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { GenerateTokenHelper } from '../helpers/ generate-token.helper';
import { IJWTUserPayload } from '../interfaces/jwt-user-payload.interface';
import { jwtConstants } from '../constants/constants';
import { FindUserEmailHelper } from '../helpers/find-user-email.helper';
import { Auth } from '../entities/auth.entity';
import { ITokensReturns } from '../interfaces/tokens-returns.interface';

@Injectable()
export class RefreshTokenUseCase {
  @Inject()
  private findUserEmailHelper: FindUserEmailHelper;

  @Inject()
  private jwtService: JwtService;

  @Inject()
  private generateTokenUtils: GenerateTokenHelper;

  async execute(refreshToken: string): Promise<ITokensReturns> {
    return await this.intermidiary(refreshToken);
  }

  private async intermidiary(refreshToken: string): Promise<ITokensReturns> {
    const payload = await this.verifyRefreshToken(refreshToken);
    const findUserEmail = await this.findUserByEmail(payload.email);

    const { access_token, refresh_token } =
      await this.generateTokenUtils.generateToken(
        findUserEmail.id,
        findUserEmail.name,
        findUserEmail.email,
      );

    return { access_token, refresh_token };
  }

  private async verifyRefreshToken(
    refreshToken: string,
  ): Promise<IJWTUserPayload> {
    const payload: IJWTUserPayload = await this.jwtService.verify(
      refreshToken,
      {
        secret: jwtConstants.secret_refresh_token_key,
      },
    );

    if (payload.type !== 'refresh_token') {
      throw new UnauthorizedException('Invalid token');
    }

    return payload;
  }

  private async findUserByEmail(email: string): Promise<Auth> {
    const user = await this.findUserEmailHelper.execute(email);
    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }
}
