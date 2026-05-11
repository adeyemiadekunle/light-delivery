import { AddressType } from '@prisma/client';
import { MerchantsService } from './merchants.service';

describe('MerchantsService', () => {
  const publicIds = {
    generateBusinessId: () => 'BUS-TEST000000',
  };

  it('builds merchant create data with public business id and nested address', () => {
    const service = new MerchantsService({} as never, publicIds as never);

    expect(
      service.buildCreateData({
        name: 'Amina Stores Limited',
        code: 'AMINA-STORES',
        contactName: 'Amina Bello',
        phone: '08030000000',
        email: 'ops@aminastores.example',
        address: {
          line1: '14 Broad Street',
          freeformCity: 'Lagos Island',
          freeformState: 'Lagos',
          postcode: '102273',
        },
      }),
    ).toEqual({
      publicId: 'BUS-TEST000000',
      name: 'Amina Stores Limited',
      code: 'AMINA-STORES',
      contactName: 'Amina Bello',
      phone: '08030000000',
      email: 'ops@aminastores.example',
      addresses: {
        create: [
          {
            type: AddressType.MERCHANT,
            line1: '14 Broad Street',
            freeformCity: 'Lagos Island',
            freeformState: 'Lagos',
            postcode: '102273',
          },
        ],
      },
    });
  });

  it('finds a public business profile by public id without exposing internal ids', async () => {
    const service = new MerchantsService(
      {
        merchant: {
          findUnique: jest.fn().mockResolvedValue({
            publicId: 'BUS-TEST000000',
            name: 'Light Foods Limited',
            code: 'LIGHT-FOODS',
            contactName: 'Tunde Ade',
            phone: '08031111111',
            email: 'ops@lightfoods.example',
            isActive: true,
          }),
        },
      } as never,
      publicIds as never,
    );

    await expect(service.findPublicProfileByPublicId('BUS-TEST000000')).resolves.toEqual({
      publicId: 'BUS-TEST000000',
      name: 'Light Foods Limited',
      code: 'LIGHT-FOODS',
      contactName: 'Tunde Ade',
      phone: '08031111111',
      email: 'ops@lightfoods.example',
      isActive: true,
    });
  });
});
