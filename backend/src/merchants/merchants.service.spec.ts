import { AddressType } from '@prisma/client';
import { MerchantsService } from './merchants.service';

describe('MerchantsService', () => {
  const publicIds = {
    generateBusinessId: () => 'BUS-TEST000000',
  };
  const operationalCodes = {
    generateBusinessCode: () => 'BUS-AMINA-STORES-LIMITED-001',
  };

  it('builds a pending merchant application without an operational code', () => {
    const service = new MerchantsService(
      {} as never,
      publicIds as never,
      operationalCodes as never,
    );

    expect(
      service.buildCreateData({
        name: 'Amina Stores Limited',
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
      contactName: 'Amina Bello',
      phone: '08030000000',
      email: 'ops@aminastores.example',
      status: 'PENDING',
      isActive: false,
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

  it('approves a pending merchant and assigns the next operational code', async () => {
    const prisma = {
      merchant: {
        findUnique: jest.fn().mockResolvedValue({
          id: 'merchant-1',
          publicId: 'BUS-TEST000000',
          name: 'Amina Stores Limited',
          code: null,
          status: 'PENDING',
        }),
        count: jest.fn().mockResolvedValue(0),
        update: jest.fn().mockResolvedValue({
          publicId: 'BUS-TEST000000',
          code: 'BUS-AMINA-STORES-LIMITED-001',
          status: 'ACTIVE',
          isActive: true,
        }),
      },
    };
    const codes = {
      generateBusinessCode: jest.fn().mockReturnValue('BUS-AMINA-STORES-LIMITED-001'),
    };
    const service = new MerchantsService(prisma as never, publicIds as never, codes as never);

    await expect(service.approve('BUS-TEST000000')).resolves.toEqual({
      publicId: 'BUS-TEST000000',
      code: 'BUS-AMINA-STORES-LIMITED-001',
      status: 'ACTIVE',
      isActive: true,
    });
    expect(codes.generateBusinessCode).toHaveBeenCalledWith('Amina Stores Limited', 1);
    expect(prisma.merchant.update).toHaveBeenCalledWith({
      where: { id: 'merchant-1' },
      data: {
        code: 'BUS-AMINA-STORES-LIMITED-001',
        status: 'ACTIVE',
        isActive: true,
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
            status: 'ACTIVE',
            isActive: true,
          }),
        },
      } as never,
      publicIds as never,
      operationalCodes as never,
    );

    await expect(service.findPublicProfileByPublicId('BUS-TEST000000')).resolves.toEqual({
      publicId: 'BUS-TEST000000',
      name: 'Light Foods Limited',
      code: 'LIGHT-FOODS',
      contactName: 'Tunde Ade',
      phone: '08031111111',
      email: 'ops@lightfoods.example',
      status: 'ACTIVE',
      isActive: true,
    });
  });
});
