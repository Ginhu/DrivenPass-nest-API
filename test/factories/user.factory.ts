import { faker } from '@faker-js/faker';

export class UserFactory {
  private email: string;
  private password: string;

  constructor() {
    this.email = faker.internet.email();
    this.password = '1234567aA*';
  }

  get Infos() {
    return { email: this.email, password: this.password };
  }
}

export class UserType {
  private email: string;
  private password: string;
}
