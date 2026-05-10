import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateHubDto } from './dto/create-hub.dto';
import { HubsService } from './hubs.service';

@Controller('hubs')
export class HubsController {
  constructor(private readonly hubsService: HubsService) {}

  @Post()
  create(@Body() input: CreateHubDto) {
    return this.hubsService.create(input);
  }

  @Get()
  list() {
    return this.hubsService.list();
  }
}
