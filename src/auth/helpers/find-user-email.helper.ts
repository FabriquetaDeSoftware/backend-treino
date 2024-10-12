import { Inject, Injectable } from '@nestjs/common';
import { IAuthRepository } from '../interfaces/auth-repository.interface';
import { Auth } from '../entities/auth.entity';

@Injectable()
export class FindUserEmailHelper {
  @Inject('IAuthRepository')
  private authRepository: IAuthRepository;

  async execute(email: string): Promise<Auth | void> {
    const findUserEmail = await this.authRepository.findOneByEmail(email);

    return findUserEmail;
  }
}
