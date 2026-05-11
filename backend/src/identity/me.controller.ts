import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from './current-user.type';
import { CurrentUserContext } from './decorators/current-user.decorator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { MeService } from './me.service';

@ApiTags('me')
@ApiBearerAuth('bearer')
@UseGuards(JwtAuthGuard)
@Controller('me')
export class MeController {
  constructor(private readonly meService: MeService) {}

  @ApiOperation({ summary: 'Return the authenticated user profile' })
  @ApiOkResponse({ description: 'Authenticated user public profile and roles' })
  @Get()
  getProfile(@CurrentUserContext() user: CurrentUser) {
    return this.meService.getProfile(user);
  }
}
