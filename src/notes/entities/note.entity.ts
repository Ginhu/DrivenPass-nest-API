import { Users } from '@prisma/client';

export class Note {
  private _user: Users;
  private _titulo: string;
  private _note: string;

  constructor(user: Users, titulo: string, note: string) {
    this._user = user;
    this._titulo = titulo;
    this._note = note;
  }

  get user() {
    return this._user;
  }

  get titulo() {
    return this._titulo;
  }

  get note() {
    return this.note;
  }
}
