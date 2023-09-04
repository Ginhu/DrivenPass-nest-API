import { faker } from '@faker-js/faker';

export class CardFactory {
  private number: number;
  private name: string;
  private cvc: number;
  private expirationDate: Date;
  private password: string;
  private virtual: boolean;
  private type: string;
  private rotulo: string;

  constructor() {
    this.number = faker.number.int({
      min: 1000,
      max: 100000,
    });
    this.name = faker.person.fullName();
    this.cvc = faker.number.int({ min: 100, max: 999 });
    this.expirationDate = faker.date.anytime();
    this.password = faker.internet.password({ length: 8 });
    this.virtual = false;
    this.type = 'Credito';
    this.rotulo = faker.lorem.words({ min: 1, max: 3 });
  }

  get infos() {
    return {
      number: this.number,
      name: this.name,
      cvc: this.cvc,
      expirationDate: this.expirationDate,
      password: this.password,
      virtual: this.virtual,
      type: this.type,
      rotulo: this.rotulo,
    };
  }
}
