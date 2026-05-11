import { PublicIdService } from './public-id.service';

describe('PublicIdService', () => {
  it('generates prefixed public ids for external-facing entities', () => {
    const service = new PublicIdService();

    expect(service.generateUserId()).toMatch(/^USR-[A-Z0-9]{12}$/);
    expect(service.generateCustomerId()).toMatch(/^CUS-[A-Z0-9]{12}$/);
    expect(service.generateBusinessId()).toMatch(/^BUS-[A-Z0-9]{12}$/);
    expect(service.generateHubId()).toMatch(/^HUB-[A-Z0-9]{12}$/);
    expect(service.generatePartnerShopId()).toMatch(/^PSH-[A-Z0-9]{12}$/);
    expect(service.generatePartnerVehicleId()).toMatch(/^VEH-[A-Z0-9]{12}$/);
    expect(service.generateDriverId()).toMatch(/^DRV-[A-Z0-9]{12}$/);
  });
});
