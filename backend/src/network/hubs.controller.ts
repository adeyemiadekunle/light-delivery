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

  @ApiOperation({ summary: 'Get a hub profile by public id' })
  @ApiParam({ name: 'publicId', description: 'Hub public id' })
  @ApiOkResponse({ description: 'Hub public profile' })
  @RequirePublicIdAccess('hub')
  @UseGuards(JwtAuthGuard, ScopedPublicIdGuard)
  @Get(':publicId')
  getHub(@Param('publicId') publicId: string) {
    return this.hubsService.findPublicProfileByPublicId(publicId);
  }
}
