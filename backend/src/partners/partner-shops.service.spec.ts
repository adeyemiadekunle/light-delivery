import { PartnerShopsService } from './partner-shops.service';

describe('PartnerShopsService', () => {
  const publicIds = {
    generatePartnerShopId: () => 'PSH-TEST000000',
  };
  const operationalCodes = {
    generatePartnerShopCode: () => 'PSH-LOS-IKEJA-001',
  };

  it('builds partner shop create data with a hub relation, address, and compliance documents', () => {
    const service = new PartnerShopsService(
      {} as never,
      publicIds as never,
      operationalCodes as never,
    );

    expect(
      service.buildCreateData(
        {
          name: 'Ikeja Pickup Partner',
          contactName: 'Amina Bello',
          phone: '08030000000',
          hubPublicId: 'HUB-TEST000000',
          supportsDropoff: true,
          supportsPickup: true,
          supportsReturns: true,
          supportsPrintInShop: true,
          supportsDigitalReceipt: true,
          openingHours: {
            monday: { opens: '09:00', closes: '18:00' },
          },
          address: {
            line1: '12 Allen Avenue',
            freeformCity: 'Ikeja',
            freeformState: 'Lagos',
            latitude: 6.6018,
            longitude: 3.3515,
          },
          documents: [
            {
              type: 'BUSINESS_REGISTRATION',
              documentNumber: 'BN-12345',
              storageKey: 'partners/ps-ikj-001/business-registration.pdf',
            },
          ],
        } as never,
        {
          id: 'hub-1',
          code: 'LOS-IKEJA',
        },
        1,
      ),
    ).toEqual({
      publicId: 'PSH-TEST000000',
      name: 'Ikeja Pickup Partner',
      code: 'PSH-LOS-IKEJA-001',
      contactName: 'Amina Bello',
      phone: '08030000000',
      supportsDropoff: true,
      supportsPickup: true,
      supportsReturns: true,
      supportsPrintInShop: true,
      supportsDigitalReceipt: true,
      openingHours: {
        monday: { opens: '09:00', closes: '18:00' },
      },
      hub: {
        connect: {
          id: 'hub-1',
        },
      },
      addresses: {
        create: [
          {
            type: 'PARTNER_SHOP',
            line1: '12 Allen Avenue',
            freeformCity: 'Ikeja',
            freeformState: 'Lagos',
            latitude: 6.6018,
            longitude: 3.3515,
          },
        ],
      },
      documents: {
        create: [
          {
            type: 'BUSINESS_REGISTRATION',
            documentNumber: 'BN-12345',
            storageKey: 'partners/ps-ikj-001/business-registration.pdf',
            fileName: undefined,
            issuedAt: undefined,
            expiresAt: undefined,
            notes: undefined,
          },
        ],
      },
    });
  });

  it('resolves hub public id and creates a partner shop with the next code sequence', async () => {
    const prisma = {
      hub: {
        findUnique: jest.fn().mockResolvedValue({
          id: 'hub-1',
          code: 'LOS-IKEJA',
        }),
      },
      partnerShop: {
        count: jest.fn().mockResolvedValue(2),
        create: jest.fn().mockResolvedValue({
          publicId: 'PSH-TEST000000',
          code: 'PSH-LOS-IKEJA-003',
        }),
      },
    };
    const codes = {
      generatePartnerShopCode: jest.fn().mockReturnValue('PSH-LOS-IKEJA-003'),
    };
    const service = new PartnerShopsService(prisma as never, publicIds as never, codes as never);

    await expect(
      service.create({
        name: 'Ikeja Pickup Partner',
        contactName: 'Amina Bello',
        phone: '08030000000',
        hubPublicId: 'HUB-TEST000000',
      } as never),
    ).resolves.toEqual({
      publicId: 'PSH-TEST000000',
      code: 'PSH-LOS-IKEJA-003',
    });
    expect(prisma.hub.findUnique).toHaveBeenCalledWith({
      where: { publicId: 'HUB-TEST000000' },
      select: { id: true, code: true },
    });
    expect(prisma.partnerShop.count).toHaveBeenCalledWith({ where: { hubId: 'hub-1' } });
    expect(codes.generatePartnerShopCode).toHaveBeenCalledWith('LOS-IKEJA', 3);
  });
});
