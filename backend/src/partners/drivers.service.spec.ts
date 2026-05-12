import { DriversService } from './drivers.service';

describe('DriversService', () => {
  const publicIds = {
    generateDriverId: () => 'DRV-TEST000000',
  };
  const operationalCodes = {
    generateDriverCode: () => 'DRV-000003',
  };

  it('builds a pending driver application without an operational code', () => {
    const service = new DriversService({} as never, publicIds as never, operationalCodes as never);

    expect(
      service.buildCreateData({
        fullName: 'Tunde Ade',
        phone: '08031111111',
        userId: 'user-1',
        documents: [
          {
            type: 'DRIVER_LICENSE',
            documentNumber: 'DL-123',
            storageKey: 'drivers/tunde-ade/license.pdf',
          },
        ],
      } as never),
    ).toEqual({
      publicId: 'DRV-TEST000000',
      fullName: 'Tunde Ade',
      phone: '08031111111',
      status: 'PENDING',
      user: {
        connect: {
          id: 'user-1',
        },
      },
      documents: {
        create: [
          {
            type: 'DRIVER_LICENSE',
            documentNumber: 'DL-123',
            storageKey: 'drivers/tunde-ade/license.pdf',
          },
        ],
      },
    });
  });

  it('approves a pending driver and assigns the next operational code', async () => {
    const prisma = {
      driver: {
        findUnique: jest.fn().mockResolvedValue({
          id: 'driver-1',
          publicId: 'DRV-TEST000000',
          code: null,
          status: 'PENDING',
        }),
        count: jest.fn().mockResolvedValue(2),
        update: jest.fn().mockResolvedValue({
          publicId: 'DRV-TEST000000',
          code: 'DRV-000003',
          status: 'ACTIVE',
        }),
      },
    };
    const codes = {
      generateDriverCode: jest.fn().mockReturnValue('DRV-000003'),
    };
    const service = new DriversService(prisma as never, publicIds as never, codes as never);

    await expect(service.approve('DRV-TEST000000')).resolves.toEqual({
      publicId: 'DRV-TEST000000',
      code: 'DRV-000003',
      status: 'ACTIVE',
    });
    expect(prisma.driver.count).toHaveBeenCalledWith({
      where: {
        code: { not: null },
      },
    });
    expect(prisma.driver.update).toHaveBeenCalledWith({
      where: { id: 'driver-1' },
      data: {
        code: 'DRV-000003',
        status: 'ACTIVE',
      },
    });
  });

  it('finds a public driver profile by public id without exposing internal ids', async () => {
    const service = new DriversService(
      {
        driver: {
          findUnique: jest.fn().mockResolvedValue({
            publicId: 'DRV-TEST000000',
            code: 'DRV-000003',
            fullName: 'Tunde Ade',
            phone: '08031111111',
            status: 'ACTIVE',
          }),
        },
      } as never,
      publicIds as never,
      operationalCodes as never,
    );

    await expect(service.findPublicProfileByPublicId('DRV-TEST000000')).resolves.toEqual({
      publicId: 'DRV-TEST000000',
      code: 'DRV-000003',
      fullName: 'Tunde Ade',
      phone: '08031111111',
      status: 'ACTIVE',
    });
  });
});
