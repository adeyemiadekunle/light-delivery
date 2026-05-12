import { Module } from '@nestjs/common';
import { OperationalCodeService } from '../common/ids/operational-code.service';
import { PublicIdService } from '../common/ids/public-id.service';
import { IdentityModule } from '../identity/identity.module';
import { BusinessesController } from './businesses.controller';
import { MerchantsController } from './merchants.controller';
import { MerchantsService } from './merchants.service';

@Module({
  imports: [IdentityModule],
  controllers: [MerchantsController, BusinessesController],
  providers: [MerchantsService, PublicIdService, OperationalCodeService],
  exports: [MerchantsService],
})
export class MerchantsModule {}
