import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, EventPattern } from '@nestjs/microservices';
import { SMP } from './smp.dto';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @MessagePattern({ cmd: 'get_smps'})
  async getsmp() {
    return this.appService.getsmps();
  }

  @MessagePattern({ cmd: 'get_projected_poolprice'})
  async getProjectedPrice() {
    return this.appService.calculateProjectedPrice();
  }

  @MessagePattern({ cmd: 'get_offers'})
  async getOffers() {
    return this.appService.getOffers();
  }

  @MessagePattern({ cmd: 'get_bids'})
  async getBids() {
    return this.appService.getBids();
  }

  @MessagePattern({ cmd: 'get_dispatched_offers'})
  async getDispatchedOffers() {
    return this.appService.getDispatchedOffers();
  }

  @MessagePattern({ cmd: 'get_total_demand_minutes'})
  async getTotalDemandMinutes() {
    return this.appService.getTotalDemandMinutes();
  }

  @MessagePattern({ cmd: 'get_marginal_offer'})
  async getMarginalOffer(timestamp: number) {
    return this.appService.getMarginalOffer(timestamp);
  }

  @MessagePattern({ cmd: 'get_total_demand'})
  async getTotalDemand(timestamp: number) {
    return this.appService.getTotalDemand(timestamp);
  }

  @MessagePattern({ cmd: 'get_min_max_prices'})
  async getMinMaxPrices() {
    return this.appService.getMinMaxPrices();
  }
}
