import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CardsService } from './cards.service';
import { CreateCardDto } from './dto/create-card.dto';
import { AuthGuard } from '../guards/auth.guard';
import { User } from '../decorators/user.decorator';
import { Users } from '@prisma/client';

@Controller('cards')
@UseGuards(AuthGuard)
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Post()
  create(@Body() createCardDto: CreateCardDto, @User() user: Users) {
    return this.cardsService.create(createCardDto, user);
  }

  @Get()
  findAll(@User() user: Users) {
    return this.cardsService.findAll(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @User() user: Users) {
    return this.cardsService.findOne(user, +id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @User() user: Users) {
    return this.cardsService.remove(user, +id);
  }
}
