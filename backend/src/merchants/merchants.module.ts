import { Module } from '@nestjs/common';
import { PublicIdService } from '../common/ids/public-id.service';
import { MerchantsController } from './merchants.controller';
import { MerchantsService } from './merchants.service';

@Module({
  controllers: [MerchantsController],
  providers: [MerchantsService, PublicIdService],
  exports: [MerchantsService],
})
export class MerchantsModule {}
