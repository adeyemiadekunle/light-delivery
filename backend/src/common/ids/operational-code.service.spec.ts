import { OperationalCodeService } from './operational-code.service';

describe('OperationalCodeService', () => {
  it('generates partner shop codes from the controlling hub code and sequence', () => {
    const service = new OperationalCodeService();

    expect(service.generatePartnerShopCode('LOS-IKEJA', 1)).toBe('PSH-LOS-IKEJA-001');
    expect(service.generatePartnerShopCode('LOS-IKEJA', 23)).toBe('PSH-LOS-IKEJA-023');
  });
});
