import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCardDto } from './dto/create-card.dto';
import { Users } from '@prisma/client';
import { CardsRepository } from './cards.repository';

@Injectable()
export class CardsService {
  private secret = process.env.CRYPTR_SECRET;
  private Cryptr = require('cryptr');
  private cryptr = new this.Cryptr(this.secret);

  constructor(private readonly cardsRepository: CardsRepository) {}
  async create(createCardDto: CreateCardDto, user: Users) {
    const card = await this.cardsRepository.findCardByUserIdAndRotulo(
      user.id,
      createCardDto.rotulo,
    );

    if (card)
      throw new ConflictException(
        'Já existe um cartão com esse nome cadastrado!',
      );

    const cardNumber = await this.cardsRepository.findCardByNumber(
      createCardDto.number,
    );
    if (cardNumber)
      throw new ConflictException(
        'Já existe um cartão com esse número cadastrado!',
      );

    return await this.cardsRepository.createCard(user, createCardDto);
  }

  async findAll(user: Users) {
    const cards = await this.cardsRepository.findAllUserCards(user);

    return cards.map((el) => {
      return { ...el, password: this.cryptr.decrypt(el.password) };
    });
  }

  async findOne(user: Users, id: number) {
    const card = await this.cardsRepository.findCardById(id);
    if (!card)
      throw new NotFoundException(
        'Nenhum cartão encontrado com o id fornecido!',
      );
    if (card.usersId !== user.id)
      throw new ForbiddenException(
        'Não é possível acessar cartões de outros usuários!',
      );

    return card;
  }

  async remove(user: Users, id: number) {
    await this.findOne(user, id);

    return await this.cardsRepository.deletCardById(id);
  }

  async deleteAll(userId: number) {
    return await this.cardsRepository.deleteAll(userId);
  }
}
