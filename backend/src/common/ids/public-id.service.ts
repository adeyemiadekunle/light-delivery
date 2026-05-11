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

  generateHubId() {
    return `HUB-${randomCode(12)}`;
  }

  generatePartnerShopId() {
    return `PSH-${randomCode(12)}`;
  }

  generatePartnerVehicleId() {
    return `VEH-${randomCode(12)}`;
  }

  generateDriverId() {
    return `DRV-${randomCode(12)}`;
  }
}
