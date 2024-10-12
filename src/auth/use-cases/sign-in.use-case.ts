import { Inject, Injectable } from '@nestjs/common';
import { GenerateTokenHelper } from '../helpers/ generate-token.helper';
import { ITokensReturns } from '../interfaces/tokens-returns.interface';
import { UserValidatorProvider } from '../providers/user-validator.provider';
import { Auth } from '../entities/auth.entity';
import { SignInAuthDto } from '../dto/sign-in-auth.dto';
import { FindUserEmailHelper } from '../helpers/find-user-email.helper';

@Injectable()
export class SignInUseCase {
  @Inject()
  private generateTokenUtils: GenerateTokenHelper;

  @Inject()
  private userValidatorProvider: UserValidatorProvider;

  @Inject()
  private findUserEmailHelper: FindUserEmailHelper;

  async execute(input: SignInAuthDto): Promise<ITokensReturns> {
    return await this.intermidiary(input.email);
  }

  async validateUser({ email, password }: SignInAuthDto): Promise<Auth> {
    return await this.userValidatorProvider.execute({ email, password });
  }

  private async intermidiary(email: string): Promise<ITokensReturns> {
    const user = await this.findUserByEmail(email);

    const { access_token, refresh_token } =
      await this.generateTokenUtils.generateToken(
        user.id,
        user.name,
        user.email,
      );

    return { access_token, refresh_token };
  }

  private async findUserByEmail(email: string): Promise<Auth> {
    const user = await this.findUserEmailHelper.execute(email);
    if (!user) {
      return null;
    }

    return user;
  }
}
