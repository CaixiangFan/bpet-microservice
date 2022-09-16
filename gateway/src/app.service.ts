import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApproveRequest } from './approve-request.dto';
import { TokenRequest } from './token-request.dto';
@Injectable()
export class AppService {
  constructor(
    @Inject('ADMIN_SERVICE') private adminClient: ClientProxy,
    @Inject('REGISTRY_SERVICE') private registryClient: ClientProxy,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async getBalance(account: string) {
    console.log(`backend service account: ${account}`);
    // const balance = await this.adminClient.send({ cmd: 'get_balance' }, account);
    // console.log(`backend service received balance: ${balance}`);
    // return balance;
    return this.adminClient.send({ cmd: 'get_balance' }, account);
  }

  async getSuppliers() {
    return this.adminClient.send({ cmd: 'get_suppliers' }, {});
  }

  async getConsumers() {
    return this.adminClient.send({ cmd: 'get_consumers'}, {});
  }

  approve(approveRequest: ApproveRequest) {
    this.adminClient.emit(
      'approved',
      approveRequest,
    );
  }

  requestToken(tokenRequest: TokenRequest) {
    this.adminClient.emit(
      'token_requested',
      tokenRequest,
    );
  }

  async isRegisteredSupplier(account: string) {
    return this.registryClient.send({ cmd: 'is_registered_supplier'}, account);
  }

  async isRegisteredConsumer(account: string) {
    return this.registryClient.send({ cmd: 'is_registered_consumer'}, account);
  }

  async getSupplier(account: string) {
    return this.registryClient.send({ cmd: 'get_supplier'}, account);
  }

  async getConsumer(account: string) {
    return this.registryClient.send({ cmd: 'get_consumer'}, account);
  }
}
