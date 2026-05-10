import { Module } from '@nestjs/common';
import { PricingModule } from '../pricing/pricing.module';
import { ParcelsController } from './parcels.controller';
import { ParcelsService } from './parcels.service';
import { TrackingController } from './tracking.controller';
import { WaybillService } from './waybill.service';

@Module({
  imports: [PricingModule],
  controllers: [ParcelsController, TrackingController],
  providers: [ParcelsService, WaybillService],
  exports: [ParcelsService, WaybillService],
})
export class ParcelsModule {}
