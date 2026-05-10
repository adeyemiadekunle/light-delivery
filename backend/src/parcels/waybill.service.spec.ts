import { WaybillService } from './waybill.service';

describe('WaybillService', () => {
  it('generates a Nigerian delivery waybill with ALD prefix', () => {
    const service = new WaybillService();

    expect(service.generate('LOS')).toMatch(/^ALD-LOS-[A-Z0-9]{10}$/);
  });
});
