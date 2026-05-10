import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateDriverDto } from './dto/create-driver.dto';
import { CreatePartnerShopDto } from './dto/create-partner-shop.dto';
import { CreatePartnerVehicleDto } from './dto/create-partner-vehicle.dto';
import { DriversService } from './drivers.service';
import { PartnerShopsService } from './partner-shops.service';
import { PartnerVehiclesService } from './partner-vehicles.service';

@Controller('partners')
export class PartnersController {
  constructor(
    private readonly partnerShopsService: PartnerShopsService,
    private readonly partnerVehiclesService: PartnerVehiclesService,
    private readonly driversService: DriversService,
  ) {}

  @Post('shops')
  createShop(@Body() input: CreatePartnerShopDto) {
    return this.partnerShopsService.create(input);
  }

  @Get('shops')
  listShops() {
    return this.partnerShopsService.list();
  }

  @Post('vehicles')
  createVehicle(@Body() input: CreatePartnerVehicleDto) {
    return this.partnerVehiclesService.create(input);
  }

  @Get('vehicles')
  listVehicles() {
    return this.partnerVehiclesService.list();
  }

  @Post('drivers')
  createDriver(@Body() input: CreateDriverDto) {
    return this.driversService.create(input);
  }

  @Get('drivers')
  listDrivers() {
    return this.driversService.list();
  }
}
