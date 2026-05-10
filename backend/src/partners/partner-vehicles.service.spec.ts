import { PartnerVehiclesService } from './partner-vehicles.service';

describe('PartnerVehiclesService', () => {
  it('builds partner vehicle create data with compliance documents', () => {
    const service = new PartnerVehiclesService({} as never);

    expect(
      service.buildCreateData({
        partnerShopId: 'partner-shop-1',
        plateNumber: 'ABC-123-LA',
        make: 'Toyota',
        model: 'HiAce',
        capacityKg: 1200,
        documents: [
          {
            type: 'VEHICLE_INSURANCE',
            documentNumber: 'INS-123',
            storageKey: 'vehicles/abc-123-la/insurance.pdf',
          },
        ],
      } as never),
    ).toEqual({
      plateNumber: 'ABC-123-LA',
      make: 'Toyota',
      model: 'HiAce',
      capacityKg: 1200,
      partnerShop: {
        connect: {
          id: 'partner-shop-1',
        },
      },
      documents: {
        create: [
          {
            type: 'VEHICLE_INSURANCE',
            documentNumber: 'INS-123',
            storageKey: 'vehicles/abc-123-la/insurance.pdf',
          },
        ],
      },
    });
  });
});
