import { Controller, Get, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('app')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  @ApiOperation({ summary: 'Checks APIs health' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Everything is okay!' })
  getHello(): string {
    return this.appService.getHello();
  }
}
