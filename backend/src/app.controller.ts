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

  @Get('/balance/:account')
  async getBalance(@Param('account') account: string){
    const balance = await this.appService.getBalance(account);
    console.log(`account: ${account}, balance: ${balance}`);
    return {
      account,
      balance,
      timestamp: new Date(),
    };
  }

  @Get('/suppliers')
  async getSuppliers() {
    const suppliers = await this.appService.getSuppliers();
    return suppliers;
  }

  @Get('/consumers')
  async getConsumers() {
    const consumers = await this.appService.getConsumers();
    return consumers;
  }

  @Post('/approve')
  approve(@Body() approveRequest: ApproveRequest) {
    this.appService.approve(approveRequest);
    // return txHash;
  }
s
  @Post('/token')
  requestToken(@Body() tokenRequest: TokenRequest) {
    this.appService.requestToken(tokenRequest);
    // return txHash;
  }
}
