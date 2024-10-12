import { Inject, Injectable } from '@nestjs/common';
import { HashUtils } from 'src/utils/hash.utils';
import { Auth } from '../entities/auth.entity';
import { SignInAuthDto } from '../dto/sign-in-auth.dto';
import { FindUserEmailHelper } from '../helpers/find-user-email.helper';

@Injectable()
export class UserValidatorProvider {
  @Inject()
  private findUserEmailHelper: FindUserEmailHelper;

  @Inject()
  private hashUtils: HashUtils;

  async execute({ email, password }: SignInAuthDto): Promise<Auth> {
    return await this.intermidiary({ email, password });
  }

  private async intermidiary({
    email,
    password,
  }: SignInAuthDto): Promise<Auth> {
    const user = await this.findUserByEmail(email);
    if (!user) {
      return null;
    }

    const isMatch = await this.decryptPassword(user.password, password);
    if (!isMatch) {
      return null;
    }

    return { ...user, password: undefined };
  }

  private async findUserByEmail(email: string): Promise<Auth | void> {
    const findUserEmail = await this.findUserEmailHelper.execute(email);

    return findUserEmail;
  }

  private async decryptPassword(
    encryptedPassword: string,
    password: string,
  ): Promise<boolean> {
    const isMatch = await this.hashUtils.compareHash(
      password,
      encryptedPassword,
    );

    return isMatch;
  }
}
