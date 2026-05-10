import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CustodyModule } from './custody/custody.module';
import { DeliveryModule } from './delivery/delivery.module';
import { IdentityModule } from './identity/identity.module';
import { IdempotencyModule } from './idempotency/idempotency.module';
import { JobsModule } from './jobs/jobs.module';
import { CustomersModule } from './customers/customers.module';
import { MerchantsModule } from './merchants/merchants.module';
import { MonitoringModule } from './monitoring/monitoring.module';
import { NetworkModule } from './network/network.module';
import { ParcelsModule } from './parcels/parcels.module';
import { PartnersModule } from './partners/partners.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.local'],
    }),
    CustodyModule,
    DeliveryModule,
    IdentityModule,
    IdempotencyModule,
    JobsModule,
    CustomersModule,
    MerchantsModule,
    MonitoringModule,
    NetworkModule,
    ParcelsModule,
    PartnersModule,
    PrismaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
