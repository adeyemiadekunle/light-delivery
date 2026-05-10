import { Injectable } from '@nestjs/common';
import { randomCode } from '../common/ids/random-code';

@Injectable()
export class WaybillService {
  generate(originCode: string) {
    return `ALD-${originCode}-${randomCode(10)}`;
  }
}
