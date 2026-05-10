import { BadRequestException } from '@nestjs/common';
import { ParcelsService } from './parcels.service';

describe('ParcelsService', () => {
  it('rejects parcel creation without sender return address details', () => {
    const service = new ParcelsService({} as never, {} as never, {} as never);

    expect(() =>
      service.validateCreateInput({
        senderName: 'Amina Store',
        senderPhone: '08030000000',
      } as never),
    ).toThrow(BadRequestException);
  });

  it('builds separate sender and receiver address records for parcel snapshots', () => {
    const service = new ParcelsService({} as never, {} as never, {} as never);

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
});
