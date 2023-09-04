import {
  Controller,
  Body,
  Post,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { EraseService } from './erase.service';
import { EraseDto } from './dto/erase.dto';
import { User } from '../decorators/user.decorator';
import { Users } from '@prisma/client';
import { AuthGuard } from '../guards/auth.guard';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('erase')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class EraseController {
  constructor(private readonly eraseService: EraseService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete user account and saved informations from the database',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'All data deleted from database',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'wrong confirmation password',
  })
  remove(@Body() eraseDto: EraseDto, @User() user: Users) {
    return this.eraseService.remove(eraseDto, user);
  }
}
