import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateMerchantDto } from './dto/create-merchant.dto';
import { MerchantsService } from './merchants.service';

@Controller('merchants')
export class MerchantsController {
  constructor(private readonly merchantsService: MerchantsService) {}

  @Post()
  create(@Body() input: CreateMerchantDto) {
    return this.merchantsService.create(input);
  }

  @Get()
  list() {
    return this.merchantsService.list();
  }
}
