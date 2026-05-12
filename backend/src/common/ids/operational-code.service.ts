import { Injectable } from '@nestjs/common';

@Injectable()
export class OperationalCodeService {
  generateHubCode(cityCode: string, localAreaCode: string, sequence: number) {
    return `${cityCode}-${localAreaCode}-${String(sequence).padStart(3, '0')}`;
  }

  generatePartnerShopCode(hubCode: string, sequence: number) {
    return `PSH-${hubCode}-${String(sequence).padStart(3, '0')}`;
  }
}
