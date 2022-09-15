import {
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  Post,
} from '@nestjs/common';
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
  async getBalance(@Param('account') account: string) {
    const balance = await this.appService.getBalance(account);
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
  async approve(@Body() approveRequest: ApproveRequest) {
    const txHash = await this.appService.approve(approveRequest.account, approveRequest.allowance);
    return txHash;
  }

  @Post('/token')
  async requestToken(@Body() tokenRequest: TokenRequest) {
    const txHash = await this.appService.requestToken(
      tokenRequest.action, 
      tokenRequest.account,
      tokenRequest.amount);
    return txHash;
  }
}
