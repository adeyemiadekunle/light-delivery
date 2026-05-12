import { MerchantsController } from './merchants.controller';

describe('MerchantsController', () => {
  it('delegates merchant approval by public id', async () => {
    const merchants = {
      approve: jest.fn().mockResolvedValue({
        publicId: 'BUS-TEST000000',
        code: 'BUS-LIGHT-FOODS-001',
        status: 'ACTIVE',
        isActive: true,
      }),
    };
    const controller = new MerchantsController(merchants as never);

    await expect(controller.approve('BUS-TEST000000')).resolves.toEqual({
      publicId: 'BUS-TEST000000',
      code: 'BUS-LIGHT-FOODS-001',
      status: 'ACTIVE',
      isActive: true,
    });
    expect(merchants.approve).toHaveBeenCalledWith('BUS-TEST000000');
  });
});
