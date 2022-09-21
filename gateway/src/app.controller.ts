import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { ApproveRequest } from './approve-request.dto';
import { TokenRequest } from './token-request.dto';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // ADMIN_SERVICE
  @Get('/admin/balance/:account')
  async getBalance(@Param('account') account: string){
    const balance = await this.appService.getBalance(account);
    return balance;
  }

  @Get('/admin/suppliers')
  async getSuppliers() {
    const suppliers = await this.appService.getSuppliers();
    return suppliers;
  }

  @Get('/admin/consumers')
  async getConsumers() {
    const consumers = await this.appService.getConsumers();
    return consumers;
  }

  @Post('/admin/approve')
  approve(@Body() approveRequest: ApproveRequest) {
    this.appService.approve(approveRequest);
  }

  @Post('/admin/token')
  requestToken(@Body() tokenRequest: TokenRequest) {
    this.appService.requestToken(tokenRequest);
  }

  // REGISTRY_SERVICE
  @Get('/registry/isregisteredsupplier/:account')
  async isRegisteredSupplier(@Param('account') account: string) {
    const _registeredSupplier = await this.appService.isRegisteredSupplier(account);
    return _registeredSupplier;
  }

  @Get('/registry/isregisteredconsumer/:account')
  async isRegisteredConsumer(@Param('account') account: string) {
    const _registeredConsumer = await this.appService.isRegisteredConsumer(account);
    return _registeredConsumer;
  }

  @Get('/registry/getsupplier/:account')
  async getSupplier(@Param('account') account: string) {
    const _supplier = await this.appService.getSupplier(account);
    return _supplier;
  }

  @Get('/registry/getconsumer/:account')
  async getConsumer(@Param('account') account: string) {
    const _consumer = await this.appService.getConsumer(account);
    return _consumer;
  }

  // PRICE_SERVICE
  @Get('/price/getsmp')
  async getsmp() {
    const _smpList = await this.appService.getsmps();
    return _smpList;
  }

  @Get('/price/getProjectedPoolPrice')
  async getProjectedPoolPrice() {
    const _projectedPoolPrice = await this.appService.getProjectedPoolPrice();
    return _projectedPoolPrice;
  }

}
