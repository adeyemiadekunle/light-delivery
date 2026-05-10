import { Body, Controller, Post } from '@nestjs/common';
import { CustodyService } from './custody.service';
import { CreateCustodyEventDto } from './dto/create-custody-event.dto';

@Controller('custody-events')
export class CustodyController {
  constructor(private readonly custodyService: CustodyService) {}

  @Post()
  record(@Body() input: CreateCustodyEventDto) {
    return this.custodyService.record(input);
  }
}
