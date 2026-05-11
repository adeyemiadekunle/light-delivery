import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../identity/guards/jwt-auth.guard';
import {
  RequirePublicIdAccess,
  ScopedPublicIdGuard,
} from '../identity/guards/scoped-public-id.guard';
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

  @ApiOperation({ summary: 'Get a driver profile by public id' })
  @ApiParam({ name: 'publicId', description: 'Driver public id' })
  @ApiOkResponse({ description: 'Driver public profile' })
  @RequirePublicIdAccess('driver')
  @UseGuards(JwtAuthGuard, ScopedPublicIdGuard)
  @Get('drivers/:publicId')
  getDriver(@Param('publicId') publicId: string) {
    return this.driversService.findPublicProfileByPublicId(publicId);
  }
}
