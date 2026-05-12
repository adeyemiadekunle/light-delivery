import { Module } from '@nestjs/common';
import { PricingModule } from '../pricing/pricing.module';
import { ParcelsController } from './parcels.controller';
import { ParcelsService } from './parcels.service';
import { TrackingCodeService } from './tracking-code.service';
import { TrackingController } from './tracking.controller';
import { WaybillService } from './waybill.service';

@Module({
  imports: [PricingModule],
  controllers: [ParcelsController, TrackingController],
  providers: [ParcelsService, WaybillService, TrackingCodeService],
  exports: [ParcelsService, WaybillService, TrackingCodeService],
})
export class ParcelsModule {}
