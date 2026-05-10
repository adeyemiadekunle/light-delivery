import { DriversService } from './drivers.service';

describe('DriversService', () => {
  it('builds driver create data with compliance documents', () => {
    const service = new DriversService({} as never);

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
