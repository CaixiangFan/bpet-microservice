import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApproveRequest } from './approve-request.dto';
import { AllowanceRequest } from './allowance-request.dto';
import { ConsumerRegisterRequest } from './consumer-register-request.dto';
import { SupplierRegisterRequest } from './supplier-register-request.dto';
import { TokenRequest } from './token-request.dto';
@Injectable()
export class AppService {
  constructor(
    @Inject('ADMIN_SERVICE') private adminClient: ClientProxy,
    @Inject('REGISTRY_SERVICE') private registryClient: ClientProxy,
    @Inject('POOLMARKET_SERVICE') private poolmarketClient: ClientProxy,
    @Inject('ETK_SERVICE') private etkClient: ClientProxy,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  // ADMIN_SERVICE
  async getBalance(account: string) {
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

  // REGISTRY_SERVICE
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

  async getOwnerAddress() {
    return this.registryClient.send({ cmd: 'get_owner_address'}, {});
  }

  async getAllSuppliers() {
    return this.registryClient.send({ cmd: 'get_all_suppliers'}, {});
  }

  async getAllConsumers() {
    return this.registryClient.send({ cmd: 'get_all_consumers'}, {});
  }

  async registerSupplier(supplierRegistryRequest: SupplierRegisterRequest) {
    this.registryClient.emit('supplierRegistered', supplierRegistryRequest);
  }

  async registerConsumer(consumerRegistryRequest: ConsumerRegisterRequest) {
    this.registryClient.emit('consumerRegistered', consumerRegistryRequest);
  }

  // POOLMARKET_SERVICE
  async getsmps() {
    return this.poolmarketClient.send({ cmd: 'get_smps' }, {});
  }

  async getProjectedPoolPrice() {
    return this.poolmarketClient.send( { cmd: 'get_projected_poolprice' }, {});
  }

  async getOffers() {
    return this.poolmarketClient.send({ cmd: 'get_offers'}, {} );
  }

  async getBids() {
    return this.poolmarketClient.send({ cmd: 'get_bids'}, {});
  }

  async getDispatchedOffers() {
    return this.poolmarketClient.send({ cmd: 'get_dispatched_offers'}, {});
  }

  async getTotalDemandMinutes() {
    return this.poolmarketClient.send({ cmd: 'get_total_demand_minutes'}, {});
  }

  async getMarginalOffer(timestamp: number) {
    return this.poolmarketClient.send({ cmd: 'get_marginal_offer'}, timestamp);
  }

  async getTotalDemand(timestamp: number) {
    return this.poolmarketClient.send({ cmd: 'get_total_demand'}, timestamp);
  }

  async getMinMaxPrices() {
    return this.poolmarketClient.send({ cmd: 'get_min_max_prices'}, {});
  }

  // ETK_SERVICE
  async getETCOwnerAddress() {
    return this.etkClient.send({ cmd: 'get_etc_owner_address'}, {});
  }

  async allowance(allowanceRequest: AllowanceRequest) {
    return this.etkClient.send({ cmd: 'allowance'}, allowanceRequest);
  }
}
