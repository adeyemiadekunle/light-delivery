import { BadRequestException } from '@nestjs/common';
import { HubsService } from './hubs.service';

describe('HubsService', () => {
  it('rejects a hub without a city id', () => {
    const service = new HubsService({} as never);

    expect(() => service.validateCreateInput({ name: 'Ikeja Hub', code: 'LOS-IKEJA' } as never)).toThrow(
      BadRequestException,
    );
  });

  it('accepts a hub without GPS coordinates', () => {
    const service = new HubsService({} as never);

    expect(() =>
      service.validateCreateInput({ name: 'Ikeja Hub', code: 'LOS-IKEJA', cityId: 'city-1' } as never),
    ).not.toThrow();
  });

  it('maps hub address input into a separate address create payload', () => {
    const service = new HubsService({} as never);

    expect(
      service.buildCreateData({
        name: 'Ikeja Hub',
        code: 'LOS-IKEJA',
        cityId: 'city-1',
        address: '12 Allen Avenue, Ikeja',
        postcode: '100271',
        latitude: 6.6018,
        longitude: 3.3515,
      }),
    ).toEqual({
      name: 'Ikeja Hub',
      code: 'LOS-IKEJA',
      city: {
        connect: {
          id: 'city-1',
        },
      },
      addresses: {
        create: [
          {
            type: 'HUB',
            line1: '12 Allen Avenue, Ikeja',
            postcode: '100271',
            latitude: 6.6018,
            longitude: 3.3515,
          },
        ],
      },
    });
  });
});
