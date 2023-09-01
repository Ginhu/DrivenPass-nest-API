import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CredentialsService } from './credentials.service';
import { CreateCredentialDto } from './dto/create-credential.dto';
import { AuthGuard } from '../guards/auth.guard';
import { User } from '../decorators/user.decorator';
import { Users } from '@prisma/client';

@Controller('credentials')
@UseGuards(AuthGuard)
export class CredentialsController {
  constructor(private readonly credentialsService: CredentialsService) {}

  @Post()
  create(
    @Body() createCredentialDto: CreateCredentialDto,
    @User() user: Users,
  ) {
    return this.credentialsService.create(user, createCredentialDto);
  }

  @Get()
  findAll(@User() user: Users) {
    return this.credentialsService.findAll(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @User() user: Users) {
    return this.credentialsService.findOne(+id, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @User() user: Users) {
    return this.credentialsService.remove(+id, user);
  }
}
