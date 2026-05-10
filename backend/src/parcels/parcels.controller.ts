import { Body, Controller, Post } from '@nestjs/common';
import { CreateParcelDto } from './dto/create-parcel.dto';
import { ParcelsService } from './parcels.service';

@Controller('parcels')
export class ParcelsController {
  constructor(private readonly parcelsService: ParcelsService) {}

  @Post()
  create(@Body() input: CreateParcelDto) {
    return this.parcelsService.create(input);
  }
}
