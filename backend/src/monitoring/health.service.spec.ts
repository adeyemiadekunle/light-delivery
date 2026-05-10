import { HealthService } from './health.service';

describe('HealthService', () => {
  it('returns live status', () => {
    const service = new HealthService();
    expect(service.getLive()).toEqual({ status: 'live' });
  });
});
