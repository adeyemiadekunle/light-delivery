import { Body, Controller, Get, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreateMerchantDto } from './dto/create-merchant.dto';
import { MerchantsService } from './merchants.service';

@ApiTags('merchants')
@ApiBearerAuth('bearer')
@Controller('merchants')
export class MerchantsController {
  constructor(private readonly merchantsService: MerchantsService) {}

  @ApiOperation({ summary: 'Create a merchant business account with an optional address' })
  @ApiCreatedResponse({ description: 'Merchant business account created' })
  @Post()
  create(@Body() input: CreateMerchantDto) {
    return this.merchantsService.create(input);
  }

  @ApiOperation({ summary: 'List merchant business accounts' })
  @ApiOkResponse({ description: 'Merchant accounts ordered by creation date' })
  @Get()
  list() {
    return this.merchantsService.list();
  }
}
