import { PartnerShopsService } from './partner-shops.service';

describe('PartnerShopsService', () => {
  it('builds partner shop create data with address and compliance documents', () => {
    const service = new PartnerShopsService({} as never);

    expect(
      service.buildCreateData({
        name: 'Ikeja Pickup Partner',
        code: 'PS-IKJ-001',
        contactName: 'Amina Bello',
        phone: '08030000000',
        hubId: 'hub-1',
        address: {
          line1: '12 Allen Avenue',
          freeformCity: 'Ikeja',
          freeformState: 'Lagos',
        },
        documents: [
          {
            type: 'BUSINESS_REGISTRATION',
            documentNumber: 'BN-12345',
            storageKey: 'partners/ps-ikj-001/business-registration.pdf',
          },
        ],
      } as never),
    ).toEqual({
      name: 'Ikeja Pickup Partner',
      code: 'PS-IKJ-001',
      contactName: 'Amina Bello',
      phone: '08030000000',
      hubId: 'hub-1',
      addresses: {
        create: [
          {
            type: 'PARTNER_SHOP',
            line1: '12 Allen Avenue',
            freeformCity: 'Ikeja',
            freeformState: 'Lagos',
          },
        ],
      },
      documents: {
        create: [
          {
            type: 'BUSINESS_REGISTRATION',
            documentNumber: 'BN-12345',
            storageKey: 'partners/ps-ikj-001/business-registration.pdf',
          },
        ],
      },
    });
  });
});
