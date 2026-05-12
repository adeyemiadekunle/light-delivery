import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { CreateAddressDto } from './create-address.dto';

describe('CreateAddressDto', () => {
  it('accepts optional Google place metadata from address autocomplete', () => {
    const dto = plainToInstance(CreateAddressDto, {
      line1: '12 Allen Avenue',
      freeformCity: 'Ikeja',
      freeformState: 'Lagos',
      latitude: 6.6018,
      longitude: 3.3515,
      googlePlaceId: 'ChIJ2Y1b3YOOxRARKGZLG0e7XGQ',
      formattedAddress: '12 Allen Avenue, Ikeja, Lagos, Nigeria',
    });

    expect(
      validateSync(dto, {
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    ).toEqual([]);
  });
});
