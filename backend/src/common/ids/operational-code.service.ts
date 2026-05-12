import { Injectable } from '@nestjs/common';

@Injectable()
export class OperationalCodeService {
  generateHubCode(cityCode: string, localAreaCode: string, sequence: number) {
    return `${cityCode}-${localAreaCode}-${String(sequence).padStart(3, '0')}`;
  }

  generatePartnerShopCode(hubCode: string, sequence: number) {
    return `PSH-${hubCode}-${String(sequence).padStart(3, '0')}`;
  }

  generateBusinessCode(name: string, sequence: number) {
    const slug = name
      .trim()
      .toUpperCase()
      .replace(/[^A-Z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 24);

    return `BUS-${slug}-${String(sequence).padStart(3, '0')}`;
  }

  generateDriverCode(sequence: number) {
    return `DRV-${String(sequence).padStart(6, '0')}`;
  }
}
