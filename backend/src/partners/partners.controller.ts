import { Body, Controller, Get, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreateDriverDto } from './dto/create-driver.dto';
import { CreatePartnerShopDto } from './dto/create-partner-shop.dto';
import { CreatePartnerVehicleDto } from './dto/create-partner-vehicle.dto';
import { DriversService } from './drivers.service';
import { PartnerShopsService } from './partner-shops.service';
import { PartnerVehiclesService } from './partner-vehicles.service';

@ApiTags('partners')
@ApiBearerAuth('bearer')
@Controller('partners')
export class PartnersController {
  constructor(
    private readonly partnerShopsService: PartnerShopsService,
    private readonly partnerVehiclesService: PartnerVehiclesService,
    private readonly driversService: DriversService,
  ) {}

  @ApiOperation({ summary: 'Create a partner pickup shop' })
  @ApiCreatedResponse({ description: 'Partner shop created' })
  @Post('shops')
  createShop(@Body() input: CreatePartnerShopDto) {
    return this.partnerShopsService.create(input);
  }

  @ApiOperation({ summary: 'List partner pickup shops' })
  @ApiOkResponse({ description: 'Partner shops ordered by creation date' })
  @Get('shops')
  listShops() {
    return this.partnerShopsService.list();
  }

  @ApiOperation({ summary: 'Create a partner vehicle' })
  @ApiCreatedResponse({ description: 'Partner vehicle created' })
  @Post('vehicles')
  createVehicle(@Body() input: CreatePartnerVehicleDto) {
    return this.partnerVehiclesService.create(input);
  }

  @ApiOperation({ summary: 'List partner vehicles' })
  @ApiOkResponse({ description: 'Partner vehicles ordered by creation date' })
  @Get('vehicles')
  listVehicles() {
    return this.partnerVehiclesService.list();
  }

  @ApiOperation({ summary: 'Create a driver profile' })
  @ApiCreatedResponse({ description: 'Driver profile created' })
  @Post('drivers')
  createDriver(@Body() input: CreateDriverDto) {
    return this.driversService.create(input);
  }

  @ApiOperation({ summary: 'List driver profiles' })
  @ApiOkResponse({ description: 'Drivers ordered by creation date' })
  @Get('drivers')
  listDrivers() {
    return this.driversService.list();
  }
}
