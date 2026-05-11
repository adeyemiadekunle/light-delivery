import { Injectable } from '@nestjs/common';

@Injectable()
export class OperationalCodeService {
  generatePartnerShopCode(hubCode: string, sequence: number) {
    return `PSH-${hubCode}-${String(sequence).padStart(3, '0')}`;
  }
}
