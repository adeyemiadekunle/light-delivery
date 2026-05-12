import { TrackingCodeService } from './tracking-code.service';

describe('TrackingCodeService', () => {
  it('generates a 16-character public tracking code', () => {
    const service = new TrackingCodeService();

    expect(service.generate()).toMatch(/^[A-Z0-9]{16}$/);
  });
});
