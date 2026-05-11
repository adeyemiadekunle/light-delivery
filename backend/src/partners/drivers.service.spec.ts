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
      userId: 'user-1',
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
});
