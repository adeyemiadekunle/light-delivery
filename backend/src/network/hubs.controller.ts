import { Body, Controller, Get, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreateHubDto } from './dto/create-hub.dto';
import { HubsService } from './hubs.service';

@ApiTags('network')
@ApiBearerAuth('bearer')
@Controller('hubs')
export class HubsController {
  constructor(private readonly hubsService: HubsService) {}

  @ApiOperation({ summary: 'Create a hub in a required local service area' })
  @ApiCreatedResponse({ description: 'Hub created' })
  @Post()
  create(@Body() input: CreateHubDto) {
    return this.hubsService.create(input);
  }

  @ApiOperation({ summary: 'List hubs' })
  @ApiOkResponse({ description: 'Hubs ordered by name' })
  @Get()
  list() {
    return this.hubsService.list();
  }
}
