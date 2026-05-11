import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { HealthService } from './health.service';

@ApiTags('monitoring')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @ApiOperation({ summary: 'Liveness check' })
  @ApiOkResponse({ description: 'Application process is live' })
  @Get('live')
  live() {
    return this.healthService.getLive();
  }

  @ApiOperation({ summary: 'Version metadata' })
  @ApiOkResponse({ description: 'Application version metadata' })
  @Get('version')
  version() {
    return this.healthService.getVersion();
  }
}
