import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CustodyService } from './custody.service';
import { CreateCustodyEventDto } from './dto/create-custody-event.dto';

@ApiTags('custody')
@ApiBearerAuth('bearer')
@Controller('custody-events')
export class CustodyController {
  constructor(private readonly custodyService: CustodyService) {}

  @ApiOperation({ summary: 'Record an append-only custody event' })
  @ApiCreatedResponse({ description: 'Custody event recorded' })
  @Post()
  record(@Body() input: CreateCustodyEventDto) {
    return this.custodyService.record(input);
  }
}
