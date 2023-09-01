import { Injectable, UnauthorizedException } from '@nestjs/common';
import { EraseDto } from './dto/erase.dto';
import { Users } from '@prisma/client';
import { UsersService } from '../users/users.service';
import { CredentialsService } from '../credentials/credentials.service';
import { NotesService } from '../notes/notes.service';
import { CardsService } from '../cards/cards.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class EraseService {
  constructor(
    private readonly usersService: UsersService,
    private readonly credentialsService: CredentialsService,
    private readonly notesService: NotesService,
    private readonly cardsService: CardsService,
  ) {}
  async remove(eraseDto: EraseDto, user: Users) {
    const userFind = await this.usersService.getUserById(user.id);
    const comparePw = bcrypt.compareSync(eraseDto.password, userFind.password);

    if (!comparePw)
      throw new UnauthorizedException(
        'Senha inválida! Não é possível excluir a conta!',
      );

    await this.cardsService.deleteAll(user.id);
    await this.credentialsService.deleteAll(user.id);
    await this.notesService.deleteAll(user.id);
    await this.usersService.deleteAll(user.id);

    return 'All registers deleted from database';
  }
}
