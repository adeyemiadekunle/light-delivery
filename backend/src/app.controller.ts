import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('system')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({ summary: 'Return API root metadata' })
  @ApiOkResponse({ description: 'API root metadata' })
  @Get()
  getRoot() {
    return this.appService.getRoot();
  }
}
