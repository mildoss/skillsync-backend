import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  @Get()
  @ApiOperation({ summary: 'Check server health' })
  @ApiResponse({ status: 200, description: 'Server is up and running.' })
  check() {
    return { status: 'ok' };
  }
}