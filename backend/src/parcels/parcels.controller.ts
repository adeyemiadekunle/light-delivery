import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateParcelDto } from './dto/create-parcel.dto';
import { ParcelsService } from './parcels.service';

@ApiTags('parcels')
@ApiBearerAuth('bearer')
@Controller('parcels')
export class ParcelsController {
  constructor(private readonly parcelsService: ParcelsService) {}

  @ApiOperation({ summary: 'Book a parcel with sender return address details' })
  @ApiCreatedResponse({ description: 'Parcel booked with waybill and tracking code' })
  @Post()
  create(@Body() input: CreateParcelDto) {
    return this.parcelsService.create(input);
  }
}
