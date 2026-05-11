import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../identity/guards/jwt-auth.guard';
import {
  RequirePublicIdAccess,
  ScopedPublicIdGuard,
} from '../identity/guards/scoped-public-id.guard';
import { MerchantsService } from './merchants.service';

@ApiTags('businesses')
@ApiBearerAuth('bearer')
@Controller('businesses')
export class BusinessesController {
  constructor(private readonly merchantsService: MerchantsService) {}

  @ApiOperation({ summary: 'Get a business profile by public id' })
  @ApiParam({ name: 'publicId', description: 'Business public id' })
  @ApiOkResponse({ description: 'Business public profile' })
  @RequirePublicIdAccess('business')
  @UseGuards(JwtAuthGuard, ScopedPublicIdGuard)
  @Get(':publicId')
  getBusiness(@Param('publicId') publicId: string) {
    return this.merchantsService.findPublicProfileByPublicId(publicId);
  }
}
