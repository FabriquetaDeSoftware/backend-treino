import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HashUtils {
  async generateHash(data: string | Buffer): Promise<string> {
    const salt = await bcrypt.genSalt();
    const result = await bcrypt.hash(data, salt);

    return result;
  }

  async compareHash(data: string | Buffer, hash: string): Promise<boolean> {
    const isMatch = await bcrypt.compare(data, hash);

    return isMatch;
  }
}
