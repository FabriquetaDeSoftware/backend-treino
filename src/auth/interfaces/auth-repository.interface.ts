import { SignUpAuthDto } from '../dto/sign-up-auth.dto';
import { Auth } from '../entities/auth.entity';

export interface IAuthRepository {
  create(signUpAuthDto: SignUpAuthDto): Promise<Auth>;
  findOneByEmail(email: string): Promise<Auth>;
}
