import { Inject, Injectable } from '@nestjs/common';
import { IAuthRepository } from '../interfaces/auth-repository.interface';
import { Auth } from '../entities/auth.entity';
import { SignUpAuthDto } from '../dto/sign-up-auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthRepository implements IAuthRepository {
  @Inject()
  private readonly prismaService: PrismaService;

  async create(signUpAuthDto: SignUpAuthDto): Promise<Auth> {
    const result = await this.prismaService.user.create({
      data: signUpAuthDto,
    });

    return result;
  }

  async findOneByEmail(email: string): Promise<Auth> {
    const result = await this.prismaService.user.findUnique({
      where: { email },
    });

    return result;
  }
}
