import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { CardsService } from './cards.service';
import { CreateCardDto } from './dto/create-card.dto';
import { AuthGuard } from '../guards/auth.guard';
import { User } from '../decorators/user.decorator';
import { Users } from '@prisma/client';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@Controller('cards')
@UseGuards(AuthGuard)
@ApiTags('Payment Cards')
@ApiBearerAuth()
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Post()
  @ApiOperation({ summary: 'Post a new card' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Card was created' })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Missing information on the request',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Trying to create a card that already exists',
  })
  create(@Body() createCardDto: CreateCardDto, @User() user: Users) {
    return this.cardsService.create(createCardDto, user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all user cards' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Got all the user registered cards information',
  })
  findAll(@User() user: Users) {
    return this.cardsService.findAll(user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user specific card' })
  @ApiParam({ name: 'id', description: 'card id', example: 1 })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Got user card information',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'There is no card registered with the provided id',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Trying to access another user card - Forbidden',
  })
  findOne(@Param('id') id: string, @User() user: Users) {
    return this.cardsService.findOne(user, +id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user specific card' })
  @ApiParam({ name: 'id', description: 'card id', example: 1 })
  remove(@Param('id') id: string, @User() user: Users) {
    return this.cardsService.remove(user, +id);
  }
}
