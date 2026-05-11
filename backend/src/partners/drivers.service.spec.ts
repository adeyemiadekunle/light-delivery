import { DriversService } from './drivers.service';

describe('DriversService', () => {
  const publicIds = {
    generateDriverId: () => 'DRV-TEST000000',
  };

  it('builds driver create data with compliance documents', () => {
    const service = new DriversService({} as never, publicIds as never);

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

  it('finds a public driver profile by public id without exposing internal ids', async () => {
    const service = new DriversService(
      {
        driver: {
          findUnique: jest.fn().mockResolvedValue({
            publicId: 'DRV-TEST000000',
            fullName: 'Tunde Ade',
            phone: '08031111111',
            status: 'ACTIVE',
          }),
        },
      } as never,
      publicIds as never,
    );

    await expect(service.findPublicProfileByPublicId('DRV-TEST000000')).resolves.toEqual({
      publicId: 'DRV-TEST000000',
      fullName: 'Tunde Ade',
      phone: '08031111111',
      status: 'ACTIVE',
    });
  });
});
