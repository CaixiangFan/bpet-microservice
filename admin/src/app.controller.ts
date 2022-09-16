import {
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  Post,
} from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, EventPattern } from '@nestjs/microservices';
import { ApproveRequest } from './approve-request.dto';
import { TokenRequest } from './token-request.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @MessagePattern({ cmd: 'get_balance' }) 
  async getBalance(account: string): Promise<number> {
    console.log('admin_service received account addr: ', account);
    return this.appService.getBalance(account);
  }

  @MessagePattern({ cmd: 'get_suppliers'})
  async getSuppliers() {
    return this.appService.getSuppliers();
  }

  @MessagePattern({ cmd: 'get_consumers'})
  async getConsumers() {
    return this.appService.getConsumers();
  }

  @EventPattern('approved')
  approve(approveRequest: ApproveRequest) {
    this.appService.approve(approveRequest);
  }

  @EventPattern('token_requested')
  requestToken(tokenRequest: TokenRequest) {
    this.appService.requestToken(tokenRequest);
  }
  // @Get('/balance/:account')
  // async getBalance(@Param('account') account: string) {
  //   const balance = await this.appService.getBalance(account);
  //   return {
  //     account,
  //     balance,
  //     timestamp: new Date(),
  //   };
  // }
  // @Get('/suppliers')
  // async getSuppliers() {
  //   const suppliers = await this.appService.getSuppliers();
  //   return suppliers;
  // }

  // @Get('/consumers')
  // async getConsumers() {
  //   const consumers = await this.appService.getConsumers();
  //   return consumers;
  // }

  // @Post('/approve')
  // async approve(@Body() approveRequest: ApproveRequest) {
  //   const txHash = await this.appService.approve(approveRequest.account, approveRequest.allowance);
  //   return txHash;
  // }

  // @Post('/token')
  // async requestToken(@Body() tokenRequest: TokenRequest) {
  //   const txHash = await this.appService.requestToken(
  //     tokenRequest.action, 
  //     tokenRequest.account,
  //     tokenRequest.amount);
  //   return txHash;
  // }
}
