import { PublicIdService } from './public-id.service';

describe('PublicIdService', () => {
  it('generates prefixed public ids for users and businesses', () => {
    const service = new PublicIdService();

    expect(service.generateUserId()).toMatch(/^USR-[A-Z0-9]{12}$/);
    expect(service.generateBusinessId()).toMatch(/^BUS-[A-Z0-9]{12}$/);
  });
});
