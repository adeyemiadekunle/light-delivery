import { Body, Controller, Get, Post } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  create(@Body() input: CreateCustomerDto) {
    return this.customersService.create(input);
  }

  @Get()
  list() {
    return this.customersService.list();
  }
}
