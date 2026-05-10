import { Module } from '@nestjs/common';
import { DriversService } from './drivers.service';
import { PartnerShopsService } from './partner-shops.service';
import { PartnerVehiclesService } from './partner-vehicles.service';
import { PartnersController } from './partners.controller';

@Module({
  controllers: [PartnersController],
  providers: [PartnerShopsService, PartnerVehiclesService, DriversService],
  exports: [PartnerShopsService, PartnerVehiclesService, DriversService],
})
export class PartnersModule {}
