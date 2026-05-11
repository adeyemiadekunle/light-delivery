import { BadRequestException } from '@nestjs/common';
import { HubsService } from './hubs.service';

describe('HubsService', () => {
  const publicIds = {
    generateHubId: () => 'HUB-TEST000000',
  };

  it('rejects a hub without a city id', () => {
    const service = new HubsService({} as never, publicIds as never);

    expect(() =>
      service.validateCreateInput({
        name: 'Ikeja Hub',
        code: 'LOS-IKEJA',
        localAreaId: 'local-area-1',
      } as never),
    ).toThrow(BadRequestException);
  });

  it('rejects a hub without a local area id', () => {
    const service = new HubsService({} as never, publicIds as never);

    expect(() =>
      service.validateCreateInput({
        name: 'Ikeja Hub',
        code: 'LOS-IKEJA',
        cityId: 'city-1',
      } as never),
    ).toThrow(BadRequestException);
  });

  it('accepts a hub without GPS coordinates when city and local area are provided', () => {
    const service = new HubsService({} as never, publicIds as never);

    expect(() =>
      service.validateCreateInput({
        name: 'Ikeja Hub',
        code: 'LOS-IKEJA',
        cityId: 'city-1',
        localAreaId: 'local-area-1',
      } as never),
    ).not.toThrow();
  });

  it('maps hub create input into public id, local area, and address payloads', () => {
    const service = new HubsService({} as never, publicIds as never);

    expect(
      service.buildCreateData({
        name: 'Ikeja Hub',
        code: 'LOS-IKEJA',
        cityId: 'city-1',
        localAreaId: 'local-area-1',
        address: '12 Allen Avenue, Ikeja',
        postcode: '100271',
        latitude: 6.6018,
        longitude: 3.3515,
      }),
    ).toEqual({
      publicId: 'HUB-TEST000000',
      name: 'Ikeja Hub',
      code: 'LOS-IKEJA',
      city: {
        connect: {
          id: 'city-1',
        },
      },
      localArea: {
        connect: {
          id: 'local-area-1',
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

  it('finds a public hub profile by public id without exposing internal ids', async () => {
    const service = new HubsService(
      {
        hub: {
          findUnique: jest.fn().mockResolvedValue({
            publicId: 'HUB-TEST000000',
            name: 'Ikeja Hub',
            code: 'LOS-IKEJA',
            cityId: 'city-1',
            localAreaId: 'local-area-1',
            isActive: true,
          }),
        },
      } as never,
      publicIds as never,
    );

    await expect(service.findPublicProfileByPublicId('HUB-TEST000000')).resolves.toEqual({
      publicId: 'HUB-TEST000000',
      name: 'Ikeja Hub',
      code: 'LOS-IKEJA',
      cityId: 'city-1',
      localAreaId: 'local-area-1',
      isActive: true,
    });
  });
});
