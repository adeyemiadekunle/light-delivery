import { Module } from '@nestjs/common';
import { OperationalCodeService } from '../common/ids/operational-code.service';
import { PublicIdService } from '../common/ids/public-id.service';
import { IdentityModule } from '../identity/identity.module';
import { HubsController } from './hubs.controller';
import { HubsService } from './hubs.service';

@Module({
  imports: [IdentityModule],
  controllers: [HubsController],
  providers: [HubsService, PublicIdService, OperationalCodeService],
  exports: [HubsService],
})
export class NetworkModule {}
