import { Injectable } from '@nestjs/common';
import { randomCode } from '../common/ids/random-code';

@Injectable()
export class TrackingCodeService {
  generate() {
    return randomCode(16);
  }
}
