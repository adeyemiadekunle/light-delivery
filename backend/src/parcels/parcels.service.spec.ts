import { BadRequestException } from '@nestjs/common';
import { ParcelsService } from './parcels.service';

describe('ParcelsService', () => {
  it('rejects parcel creation without sender return address details', () => {
    const service = new ParcelsService({} as never, {} as never, {} as never, {} as never);

    expect(() =>
      service.validateCreateInput({
        senderName: 'Amina Store',
        senderPhone: '08030000000',
      } as never),
    ).toThrow(BadRequestException);
  });

  it('builds separate sender and receiver address records for parcel snapshots', () => {
    const service = new ParcelsService({} as never, {} as never, {} as never, {} as never);

    expect(
      service.buildParcelAddressSnapshots({
        senderName: 'Amina Store',
        senderPhone: '08030000000',
        senderAddress: '12 Allen Avenue, Ikeja',
        senderPostcode: '100271',
        receiverName: 'Tunde Ade',
        receiverPhone: '08031111111',
        receiverAddress: '22 Garki Road, Abuja',
        receiverPostcode: '900001',
      } as never),
    ).toEqual({
      senderAddress: {
        create: {
          type: 'PARCEL_SENDER',
          contactName: 'Amina Store',
          contactPhone: '08030000000',
          line1: '12 Allen Avenue, Ikeja',
          postcode: '100271',
        },
      },
      receiverAddress: {
        create: {
          type: 'PARCEL_RECEIVER',
          contactName: 'Tunde Ade',
          contactPhone: '08031111111',
          line1: '22 Garki Road, Abuja',
          postcode: '900001',
        },
      },
    });
  });

  it('creates parcels with a generated 16-character public tracking code', async () => {
    const prisma = {
      parcel: {
        create: jest.fn().mockResolvedValue({ trackingCode: 'ABCD1234EFGH5678' }),
      },
    };
    const pricing = {
      quote: jest.fn().mockReturnValue({ amount: 1500 }),
    };
    const waybills = {
      generate: jest.fn().mockReturnValue('ALD-LOS-TEST000001'),
    };
    const trackingCodes = {
      generate: jest.fn().mockReturnValue('ABCD1234EFGH5678'),
    };
    const service = new ParcelsService(
      prisma as never,
      pricing as never,
      waybills as never,
      trackingCodes as never,
    );

    await service.create({
      serviceType: 'STANDARD',
      senderName: 'Amina Store',
      senderPhone: '08030000000',
      senderAddress: '12 Allen Avenue, Ikeja',
      receiverName: 'Tunde Ade',
      receiverPhone: '08031111111',
      receiverAddress: '22 Garki Road, Abuja',
      weightKg: 1,
    } as never);

    expect(trackingCodes.generate).toHaveBeenCalled();
    expect(prisma.parcel.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          trackingCode: 'ABCD1234EFGH5678',
        }),
      }),
    );
  });
});
