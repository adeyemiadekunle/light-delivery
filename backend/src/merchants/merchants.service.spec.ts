import { AddressType } from '@prisma/client';
import { MerchantsService } from './merchants.service';

describe('MerchantsService', () => {
  it('builds merchant create data with public business id and nested address', () => {
    const service = new MerchantsService(
      {} as never,
      {
        generateBusinessId: () => 'BUS-TEST000000',
      } as never,
    );

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
});
