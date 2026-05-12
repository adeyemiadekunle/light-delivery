import { PartnersController } from './partners.controller';

describe('PartnersController', () => {
  it('delegates partner shop approval by public id', async () => {
    const partnerShops = {
      approve: jest.fn().mockResolvedValue({
        publicId: 'PSH-TEST000000',
        code: 'PSH-LOS-IKEJA-001',
        status: 'ACTIVE',
      }),
    };
    const controller = new PartnersController(partnerShops as never, {} as never, {} as never);

    await expect(controller.approveShop('PSH-TEST000000')).resolves.toEqual({
      publicId: 'PSH-TEST000000',
      code: 'PSH-LOS-IKEJA-001',
      status: 'ACTIVE',
    });
    expect(partnerShops.approve).toHaveBeenCalledWith('PSH-TEST000000');
  });

  it('delegates driver approval by public id', async () => {
    const drivers = {
      approve: jest.fn().mockResolvedValue({
        publicId: 'DRV-TEST000000',
        code: 'DRV-000001',
        status: 'ACTIVE',
      }),
    };
    const controller = new PartnersController({} as never, {} as never, drivers as never);

    await expect(controller.approveDriver('DRV-TEST000000')).resolves.toEqual({
      publicId: 'DRV-TEST000000',
      code: 'DRV-000001',
      status: 'ACTIVE',
    });
    expect(drivers.approve).toHaveBeenCalledWith('DRV-TEST000000');
  });
});
