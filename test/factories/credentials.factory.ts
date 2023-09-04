import { faker } from '@faker-js/faker';
import { CreateCredentialDto } from '../../src/credentials/dto/create-credential.dto';

export class CredentialFactory extends CreateCredentialDto {
  /* private url: string;
  private login: string;
  private password: string;
  private rotulo: string; */

  constructor() {
    super();
    this.url = faker.internet.url();
    this.login = faker.internet.userName();
    this.password = faker.internet.password({ length: 8 });
    this.rotulo = faker.lorem.words({ min: 1, max: 3 });
  }

  get infos() {
    return {
      url: this.url,
      login: this.login,
      password: this.password,
      rotulo: this.rotulo,
    };
  }
}
