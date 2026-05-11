import { Module } from '@nestjs/common';
import { PublicIdService } from '../common/ids/public-id.service';
import { HubsController } from './hubs.controller';
import { HubsService } from './hubs.service';

@Module({
  controllers: [HubsController],
  providers: [HubsService, PublicIdService],
  exports: [HubsService],
})
export class NetworkModule {}
