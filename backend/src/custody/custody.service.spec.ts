import { BadRequestException } from '@nestjs/common';
import { CustodyService } from './custody.service';

describe('CustodyService', () => {
  it('rejects a scan without a parcel id', () => {
    const service = new CustodyService({} as never);

    expect(() => service.validateScan({ eventType: 'HUB_RECEIVED' } as never)).toThrow(BadRequestException);
  });
});
