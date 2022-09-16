import { Injectable } from '@nestjs/common';
import * as RegistryContractAbi from 'src/contracts/Registry.sol/Registry.json';
@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
