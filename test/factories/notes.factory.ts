import { faker } from '@faker-js/faker';

export class NotesFactory {
  private note: string;
  private titulo: string;

  constructor() {
    this.titulo = faker.lorem.words({ min: 1, max: 3 });
    this.note = faker.lorem.words({ min: 3, max: 15 });
  }

  get infos() {
    return { titulo: this.titulo, note: this.note };
  }
}
