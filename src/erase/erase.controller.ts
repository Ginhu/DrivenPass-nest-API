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

@Controller('erase')
@UseGuards(AuthGuard)
export class EraseController {
  constructor(private readonly eraseService: EraseService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  remove(@Body() eraseDto: EraseDto, @User() user: Users) {
    return this.eraseService.remove(eraseDto, user);
  }
}
