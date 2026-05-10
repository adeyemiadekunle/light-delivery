import { Controller, Get, Param } from '@nestjs/common';
import { ParcelsService } from './parcels.service';

@Controller('tracking')
export class TrackingController {
  constructor(private readonly parcelsService: ParcelsService) {}

  @Get(':code')
  getTracking(@Param('code') code: string) {
    return this.parcelsService.findByTrackingCode(code);
  }
}
