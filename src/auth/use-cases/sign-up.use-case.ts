import { Inject, Injectable } from '@nestjs/common';
import { SignUpAuthDto } from '../dto/sign-up-auth.dto';
import { Auth } from '../entities/auth.entity';
import { IAuthRepository } from '../interfaces/auth-repository.interface';
import { HashUtils } from '../../utils/hash.utils';
import { FindUserEmailHelper } from '../helpers/find-user-email.helper';

@Injectable()
export class SignUpUseCase {
  @Inject('IAuthRepository')
  private authRepository: IAuthRepository;

  @Inject()
  private hashUtils: HashUtils;

  @Inject()
  private findUserEmailHelper: FindUserEmailHelper;

  async execute(input: SignUpAuthDto): Promise<Auth> {
    return await this.intermidiary(input);
  }

  private async intermidiary(data: SignUpAuthDto): Promise<Auth> {
    const [, hashed] = await Promise.all([
      this.findUserByEmail(data.email),
      this.hashPassword(data.password),
    ]);

    const result = await this.authRepository.create({
      ...data,
      password: hashed,
    });

    return { ...result, password: undefined };
  }

  private async findUserByEmail(email: string): Promise<void> {
    const findUserEmail = await this.findUserEmailHelper.execute(email);
    if (findUserEmail) {
      throw new Error('Email already exists');
    }
  }

  private async hashPassword(password: string): Promise<string> {
    const result = await this.hashUtils.generateHash(password);

    return result;
  }
}
