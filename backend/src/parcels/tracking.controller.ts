import { Controller, Get, Param } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { ParcelsService } from './parcels.service';

@ApiTags('tracking')
@Controller('tracking')
export class TrackingController {
  constructor(private readonly parcelsService: ParcelsService) {}

  @ApiOperation({ summary: 'Get public tracking details by tracking code' })
  @ApiParam({ name: 'code', description: 'Public parcel tracking code' })
  @ApiOkResponse({ description: 'Public tracking details when the code exists' })
  @Get(':code')
  getTracking(@Param('code') code: string) {
    return this.parcelsService.findByTrackingCode(code);
  }
}
