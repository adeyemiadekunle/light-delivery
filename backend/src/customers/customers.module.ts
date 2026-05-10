import { Module } from '@nestjs/common';
import { PublicIdService } from '../common/ids/public-id.service';
import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';

@Module({
  controllers: [CustomersController],
  providers: [CustomersService, PublicIdService],
  exports: [CustomersService],
})
export class CustomersModule {}
