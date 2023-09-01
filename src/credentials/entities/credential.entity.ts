import { Users } from '@prisma/client';

export class Credential {
  private _user: Users;
  private _url: string;
  private _login: string;
  private _password: string;
  private _rotulo: string;

  constructor(
    user: Users,
    url: string,
    login: string,
    password: string,
    rotulo: string,
  ) {
    this._user = user;
    this._url = url;
    this._login = login;
    this._password = password;
    this._rotulo = rotulo;
  }

  get user() {
    return this._user;
  }

  get url() {
    return this._url;
  }

  get login() {
    return this._login;
  }

  get password() {
    return this._password;
  }

  get rotulo() {
    return this._rotulo;
  }
}
