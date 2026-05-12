import { BadRequestException } from '@nestjs/common';
import { HubsService } from './hubs.service';

describe('HubsService', () => {
  const publicIds = {
    generateHubId: () => 'HUB-TEST000000',
  };
  const operationalCodes = {
    generateHubCode: () => 'LOS-IKEJA-001',
  };

  it('rejects a hub without a city id', () => {
    const service = new HubsService({} as never, publicIds as never, operationalCodes as never);

    expect(() =>
      service.validateCreateInput({
        name: 'Ikeja Hub',
        localAreaId: 'local-area-1',
      } as never),
    ).toThrow(BadRequestException);
  });

  it('rejects a hub without a local area id', () => {
    const service = new HubsService({} as never, publicIds as never, operationalCodes as never);

    expect(() =>
      service.validateCreateInput({
        name: 'Ikeja Hub',
        cityId: 'city-1',
      } as never),
    ).toThrow(BadRequestException);
  });

  it('accepts a hub without GPS coordinates when city and local area are provided', () => {
    const service = new HubsService({} as never, publicIds as never, operationalCodes as never);

    expect(() =>
      service.validateCreateInput({
        name: 'Ikeja Hub',
        cityId: 'city-1',
        localAreaId: 'local-area-1',
      } as never),
    ).not.toThrow();
  });

  it('maps hub create input into public id, local area, and address payloads', () => {
    const service = new HubsService({} as never, publicIds as never, operationalCodes as never);

    expect(
      service.buildCreateData(
        {
          name: 'Ikeja Hub',
          cityId: 'city-1',
          localAreaId: 'local-area-1',
          address: '12 Allen Avenue, Ikeja',
          postcode: '100271',
          latitude: 6.6018,
          longitude: 3.3515,
        },
        {
          cityCode: 'LOS',
          localAreaCode: 'IKEJA',
        },
        1,
      ),
    ).toEqual({
      publicId: 'HUB-TEST000000',
      name: 'Ikeja Hub',
      code: 'LOS-IKEJA-001',
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

  it('resolves the local area and creates a hub with the next area code sequence', async () => {
    const prisma = {
      localArea: {
        findFirst: jest.fn().mockResolvedValue({
          code: 'IKEJA',
          city: {
            code: 'LOS',
          },
        }),
      },
      hub: {
        count: jest.fn().mockResolvedValue(2),
        create: jest.fn().mockResolvedValue({
          publicId: 'HUB-TEST000000',
          code: 'LOS-IKEJA-003',
        }),
      },
    };
    const codes = {
      generateHubCode: jest.fn().mockReturnValue('LOS-IKEJA-003'),
    };
    const service = new HubsService(prisma as never, publicIds as never, codes as never);

    await expect(
      service.create({
        name: 'Ikeja Hub',
        cityId: 'city-1',
        localAreaId: 'local-area-1',
      } as never),
    ).resolves.toEqual({
      publicId: 'HUB-TEST000000',
      code: 'LOS-IKEJA-003',
    });
    expect(prisma.localArea.findFirst).toHaveBeenCalledWith({
      where: {
        id: 'local-area-1',
        cityId: 'city-1',
      },
      select: {
        code: true,
        city: {
          select: {
            code: true,
          },
        },
      },
    });
    expect(prisma.hub.count).toHaveBeenCalledWith({ where: { localAreaId: 'local-area-1' } });
    expect(codes.generateHubCode).toHaveBeenCalledWith('LOS', 'IKEJA', 3);
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
      operationalCodes as never,
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
