import { AddressType } from '@prisma/client';
import { CustomersService } from './customers.service';

describe('CustomersService', () => {
  it('builds customer create data with public id and nested address', () => {
    const service = new CustomersService({} as never, {
      generateCustomerId: () => 'CUS-TEST000000',
    } as never);

    expect(
      service.buildCreateData({
        fullName: 'Amina Bello',
        phone: '08030000000',
        email: 'amina@example.com',
        address: {
          line1: '12 Allen Avenue',
          freeformCity: 'Ikeja',
          freeformState: 'Lagos',
          postcode: '100271',
        },
      }),
    ).toEqual({
      publicId: 'CUS-TEST000000',
      fullName: 'Amina Bello',
      phone: '08030000000',
      email: 'amina@example.com',
      addresses: {
        create: [
          {
            type: AddressType.CUSTOMER,
            line1: '12 Allen Avenue',
            freeformCity: 'Ikeja',
            freeformState: 'Lagos',
            postcode: '100271',
          },
        ],
      },
    });
  });
});
