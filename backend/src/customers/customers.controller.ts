import { Body, Controller, Get, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';

@ApiTags('customers')
@ApiBearerAuth('bearer')
@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @ApiOperation({ summary: 'Create a customer profile with an optional address' })
  @ApiCreatedResponse({ description: 'Customer profile created' })
  @Post()
  create(@Body() input: CreateCustomerDto) {
    return this.customersService.create(input);
  }

  @ApiOperation({ summary: 'List customer profiles' })
  @ApiOkResponse({ description: 'Customer profiles ordered by creation date' })
  @Get()
  list() {
    return this.customersService.list();
  }
}
