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
import { CredentialsService } from './credentials.service';
import { CreateCredentialDto } from './dto/create-credential.dto';
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

@Controller('credentials')
@UseGuards(AuthGuard)
@ApiTags('Login Credentials')
@ApiBearerAuth()
export class CredentialsController {
  constructor(private readonly credentialsService: CredentialsService) {}

  @Post()
  @ApiOperation({ summary: 'Post a new login credential' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Credential was created',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Missing information on the request',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Trying to create a credential that already exists',
  })
  create(
    @Body() createCredentialDto: CreateCredentialDto,
    @User() user: Users,
  ) {
    return this.credentialsService.create(user, createCredentialDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all user login credentials' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Got all the user registered credentials information',
  })
  findAll(@User() user: Users) {
    return this.credentialsService.findAll(user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user specific credential' })
  @ApiParam({ name: 'id', description: 'credential id', example: 1 })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Got user credential information',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'There is no credential registered with the provided id',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Trying to access another user credential - Forbidden',
  })
  findOne(@Param('id') id: string, @User() user: Users) {
    return this.credentialsService.findOne(+id, user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user specific credential' })
  @ApiParam({ name: 'id', description: 'credential id', example: 1 })
  remove(@Param('id') id: string, @User() user: Users) {
    return this.credentialsService.remove(+id, user);
  }
}
