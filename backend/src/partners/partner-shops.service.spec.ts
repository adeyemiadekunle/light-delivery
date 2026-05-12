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
            googlePlaceId: 'ChIJ2Y1b3YOOxRARKGZLG0e7XGQ',
            formattedAddress: '12 Allen Avenue, Ikeja, Lagos, Nigeria',
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
      ),
    ).toEqual({
      publicId: 'PSH-TEST000000',
      name: 'Ikeja Pickup Partner',
      contactName: 'Amina Bello',
      phone: '08030000000',
      status: 'PENDING',
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
            googlePlaceId: 'ChIJ2Y1b3YOOxRARKGZLG0e7XGQ',
            formattedAddress: '12 Allen Avenue, Ikeja, Lagos, Nigeria',
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

  it('resolves hub public id and creates a pending partner shop application without a code', async () => {
    const prisma = {
      hub: {
        findUnique: jest.fn().mockResolvedValue({
          id: 'hub-1',
          code: 'LOS-IKEJA',
        }),
      },
      partnerShop: {
        create: jest.fn().mockResolvedValue({
          publicId: 'PSH-TEST000000',
          code: null,
          status: 'PENDING',
        }),
      },
    };
    const service = new PartnerShopsService(
      prisma as never,
      publicIds as never,
      operationalCodes as never,
    );

    await expect(
      service.create({
        name: 'Ikeja Pickup Partner',
        contactName: 'Amina Bello',
        phone: '08030000000',
        hubPublicId: 'HUB-TEST000000',
      } as never),
    ).resolves.toEqual({
      publicId: 'PSH-TEST000000',
      code: null,
      status: 'PENDING',
    });
    expect(prisma.hub.findUnique).toHaveBeenCalledWith({
      where: { publicId: 'HUB-TEST000000' },
      select: { id: true, code: true },
    });
  });

  it('approves a pending partner shop and assigns the next operational code', async () => {
    const prisma = {
      partnerShop: {
        findUnique: jest.fn().mockResolvedValue({
          id: 'shop-1',
          publicId: 'PSH-TEST000000',
          code: null,
          status: 'PENDING',
          hubId: 'hub-1',
          hub: {
            code: 'LOS-IKEJA',
          },
        }),
        count: jest.fn().mockResolvedValue(2),
        update: jest.fn().mockResolvedValue({
          publicId: 'PSH-TEST000000',
          code: 'PSH-LOS-IKEJA-003',
          status: 'ACTIVE',
        }),
      },
    };
    const codes = {
      generatePartnerShopCode: jest.fn().mockReturnValue('PSH-LOS-IKEJA-003'),
    };
    const service = new PartnerShopsService(prisma as never, publicIds as never, codes as never);

    await expect(service.approve('PSH-TEST000000')).resolves.toEqual({
      publicId: 'PSH-TEST000000',
      code: 'PSH-LOS-IKEJA-003',
      status: 'ACTIVE',
    });
    expect(prisma.partnerShop.count).toHaveBeenCalledWith({
      where: {
        hubId: 'hub-1',
        code: { not: null },
      },
    });
    expect(prisma.partnerShop.update).toHaveBeenCalledWith({
      where: { id: 'shop-1' },
      data: {
        code: 'PSH-LOS-IKEJA-003',
        status: 'ACTIVE',
      },
    });
  });
});
