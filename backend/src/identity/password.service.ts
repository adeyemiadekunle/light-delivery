import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class PasswordService {
  async hash(password: string, saltRounds = 12) {
    return bcrypt.hash(password, saltRounds);
  }

  async verify(password: string, hash: string) {
    return bcrypt.compare(password, hash);
  }
}
