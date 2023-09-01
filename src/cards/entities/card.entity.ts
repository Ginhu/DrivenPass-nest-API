import { Users, cardType } from '@prisma/client';

export class Card {
  private _user: Users;
  private _number: number;
  private _name: string;
  private _cvc: number;
  private _expirationDate: Date;
  private _password: string;
  private _virtual: boolean;
  private _type: cardType;
  private _rotulo: string;

  constructor(
    user: Users,
    number: number,
    name: string,
    cvc: number,
    expirationDate: Date,
    password: string,
    virtual: boolean,
    type: cardType,
    rotulo: string,
  ) {
    this._user = user;
    this._number = number;
    this._name = name;
    this._cvc = cvc;
    this._expirationDate = expirationDate;
    this._password = password;
    this._virtual = virtual;
    this._type = type;
    this._rotulo = rotulo;
  }

  get user() {
    return this._user;
  }

  get number() {
    return this._number;
  }

  get name() {
    return this._name;
  }

  get cvc() {
    return this._cvc;
  }

  get expirationDate() {
    return this._expirationDate;
  }

  get password() {
    return this.password;
  }

  get virtual() {
    return this._virtual;
  }

  get type() {
    return this._type;
  }

  get rotulo() {
    return this._rotulo;
  }
}
