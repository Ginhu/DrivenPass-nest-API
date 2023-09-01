import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCredentialDto } from './dto/create-credential.dto';
import { Users } from '@prisma/client';
import { CredentialsRepository } from './credentials.repository';

@Injectable()
export class CredentialsService {
  private secret = process.env.CRYPTR_SECRET;
  private Cryptr = require('cryptr');
  private cryptr = new this.Cryptr(this.secret);
  constructor(private readonly credentialsRepository: CredentialsRepository) {}

  async create(user: Users, createCredentialDto: CreateCredentialDto) {
    const credential =
      await this.credentialsRepository.findCredentialByUserIdAndRotulo(
        user.id,
        createCredentialDto.rotulo,
      );
    if (credential) throw new ConflictException();
    return await this.credentialsRepository.createCredentials(
      user,
      createCredentialDto,
    );
  }

  async findAll(user: Users) {
    const credentials =
      await this.credentialsRepository.findCredentialsByUserId(user.id);
    return credentials.map((el) => {
      return { ...el, password: this.cryptr.decrypt(el.password) };
    });
  }

  async findOne(id: number, user: Users) {
    const credential = await this.credentialsRepository.findByIdAndUserId(id);
    if (!credential)
      throw new NotFoundException(
        "We've not found a credential with this specific id!",
      );
    if (credential.usersId !== user.id)
      throw new ForbiddenException(
        'Not allowed to access others users credentials!',
      );
    return credential;
  }

  async remove(id: number, user: Users) {
    await this.findOne(id, user);
    return this.credentialsRepository.deleteCredentialById(id);
  }

  async deleteAll(userId: number) {
    return await this.credentialsRepository.deleteAll(userId);
  }
}
