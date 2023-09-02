import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(createUserDto: CreateUserDto) {
    const user = await this.usersRepository.findByEmail(createUserDto.email);
    if (user) throw new ConflictException('email already in use!');

    return await this.usersRepository.create(createUserDto);
  }

  async signIn(createUserDto: CreateUserDto) {
    const user = await this.usersRepository.findByEmail(createUserDto.email);
    if (!user) throw new UnauthorizedException('Invalid email or password!');
    const valid = bcrypt.compareSync(createUserDto.password, user.password);

    if (!valid) throw new UnauthorizedException('Invalid email or password!');

    return user;
  }

  async getUserById(id: number) {
    return await this.usersRepository.findById(id);
  }

  async deleteAll(id: number) {
    return await this.usersRepository.deleteAll(id);
  }
}
