import { Injectable } from '@nestjs/common';
import { randomCode } from './random-code';

@Injectable()
export class PublicIdService {
  generateUserId() {
    return `USR-${randomCode(12)}`;
  }

  generateCustomerId() {
    return `CUS-${randomCode(12)}`;
  }

  generateBusinessId() {
    return `BUS-${randomCode(12)}`;
  }
}
