import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { Users } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private EXPIRATION = '1 day';

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(createUserDto: CreateUserDto) {
    const user = await this.usersService.signIn(createUserDto);

    return this.createToken(user);
  }

  createToken(user: Users) {
    const { id, email } = user;
    const token = this.jwtService.sign(
      { email },
      {
        expiresIn: this.EXPIRATION,
        subject: String(id),
      },
    );

    return token;
  }

  checkToken(token: string) {
    const data = this.jwtService.verify(token);

    return data;
  }
}
