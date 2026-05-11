import { Module } from '@nestjs/common';
import { PublicIdService } from '../common/ids/public-id.service';
import { IdentityModule } from '../identity/identity.module';
import { DriversService } from './drivers.service';
import { PartnerShopsService } from './partner-shops.service';
import { PartnerVehiclesService } from './partner-vehicles.service';
import { PartnersController } from './partners.controller';

@Module({
  imports: [IdentityModule],
  controllers: [PartnersController],
  providers: [PartnerShopsService, PartnerVehiclesService, DriversService, PublicIdService],
  exports: [PartnerShopsService, PartnerVehiclesService, DriversService],
})
export class PartnersModule {}
