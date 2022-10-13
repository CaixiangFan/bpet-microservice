import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern } from '@nestjs/microservices';
import { AllowanceRequest } from './allowance-request.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @MessagePattern({ cmd: 'get_etc_owner_address'})
  async getETCOwnerAddress() {
    return this.appService.getETCOwnerAddress();
  }

  @MessagePattern({ cmd: 'allowance'})
  async allowance(allowanceRequest: AllowanceRequest) {
    return this.appService.allowance(allowanceRequest);
  }
}
