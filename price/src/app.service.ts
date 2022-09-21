import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import { SignerService } from './shared/services/signer/signer.service';
import { ProviderService } from './shared/services/provider/provider.service';
import * as poolmarketContractAbi from 'src/contracts/PoolMarket.sol/PoolMarket.json';
import { SMP } from './smp.dto';
import { Offer } from './offer.dto';
import { Bid } from './bid.dto';
@Injectable()
export class AppService {
  poolmarketContractInstance: ethers.Contract;
  provider: ethers.providers.BaseProvider;

  constructor(
    private providerService: ProviderService,
    private signerService: SignerService) {
    this.provider = this.providerService.provider;
    const poolmarketContractAddress = process.env.POOLMARKET_CONTRACT_ADDRESS;
    if (!poolmarketContractAddress || poolmarketContractAddress.length === 0) return;
    this.poolmarketContractInstance = new ethers.Contract(
      poolmarketContractAddress,
      poolmarketContractAbi,
      this.signerService.signer
    );
  }
  getHello(): string {
    return 'Hello World!';
  }

  convertBigNumberToNumber(value): number {
    const decimals = 18;
    return Math.round(Number(ethers.utils.formatEther(value)) * 10 ** decimals);
  }

  async getsmps(): Promise<SMP[]> {
    var datetime = new Date();
    const smps = [];
    const second = datetime.getSeconds();
    const minute = datetime.getMinutes();
    const hour = datetime.getHours();
    const currentTime = Math.floor(datetime.getTime() / 1000);
    const hourStart = currentTime - second - 60*minute;
    for (let i=1; i<=60; i++) {
      var currentMinute = hourStart + 60 * i;
      if (currentMinute < currentTime) {
        var smp = await this.poolmarketContractInstance.getSMP(currentMinute);
        if (smp > 0) {
          var date = new Date(currentMinute * 1000);
          var he = date.toLocaleDateString("en-us");
          var minutes = date.getMinutes();
          var marginalOffer = await this.poolmarketContractInstance.getMarginalOffer(currentMinute);
          var volume = this.convertBigNumberToNumber(marginalOffer.amount);
          // smps.push({"DateHE": `${he} ${hour+1}`, "Time": `${hour}:${minutes}`, "Price": convertBigNumberToNumber(smp), "Volume": volume});
          smps.push(new SMP(
              `${he} ${hour+1}`, 
              `${hour}:${minutes}`, 
              this.convertBigNumberToNumber(smp), 
              volume)
            );
        }
      }
    }
    return smps;
  }

    //ToDo: weighted average => calculate smp for every hour start
    async calculateProjectedPrice() {
      const _smps = await this.getsmps();
      var projectedPrice = 0;
      if (_smps.length == 0) return projectedPrice;
      if (_smps.length == 1) {
        projectedPrice = Number(_smps[0].Price);
        return projectedPrice;
      }
      for (let i=0; i<_smps.length; i++) {
        var price = Number(_smps[i].Price);
        var duration = 0;
        if (i == 0) {
          duration = Number(_smps[i+1].Time.split(':')[1]);
        } else if (i == _smps.length - 1) {
          duration = 60 - Number(_smps[i].Time.split(':')[1]);
        } else {
          duration = Number(_smps[i+1].Time.split(':')[1]) - Number(_smps[i].Time.split(':')[1]);
        }
        projectedPrice += price * duration;
      }
      return Math.round((projectedPrice / 60) * 100) / 100;
    }
  
    async getOffers(): Promise<Offer[]> {
      const offerIds = await this.poolmarketContractInstance.getValidOfferIDs();
      var offers = [];
      for (let i=0; i<offerIds.length; i++) {
        var offer = await this.poolmarketContractInstance.getEnergyOffer(offerIds[i]);
        var amount = this.convertBigNumberToNumber(offer.amount);
        var price = this.convertBigNumberToNumber(offer.price);
        var submitMinute = this.convertBigNumberToNumber(offer.submitMinute);
        var supplierAccount = offer.supplierAccount;
        var isValid = offer.isValid;
        // offers.push({amount, price, submitMinute, supplierAccount, isValid});
        offers.push(new Offer(amount, price, submitMinute, supplierAccount, isValid))
      }
      return offers;
    }
  
    async getBids(): Promise<Bid[]> {
      const bidIds = await this.poolmarketContractInstance.getValidBidIDs();
      var bids = [];
      for (let i=0; i<bidIds.length; i++) {
        var bid = await this.poolmarketContractInstance.getEnergyBid(bidIds[i]);
        var submitTimeStamp = this.convertBigNumberToNumber(bid.submitMinute);
        var submitTime = new Date(submitTimeStamp * 1000);

        // bids.push({"submitAt": submitTime.toLocaleTimeString('en-us'), 
        //           "amount": this.convertBigNumberToNumber(bid.amount),
        //           "price": this.convertBigNumberToNumber(bid.price),
        //           "submitMinute": this.convertBigNumberToNumber(bid.submitMinute),
        //           "consumerAccount": bid.consumerAccount});
        bids.push(new Bid(
          submitTime.toLocaleTimeString('en-us'),
          this.convertBigNumberToNumber(bid.amount),
          this.convertBigNumberToNumber(bid.price),
          this.convertBigNumberToNumber(bid.submitMinute),
          bid.consumerAccount,
        ))
      }
      return bids;
    }
  
    async getDispatchedOffers() {
      const currBlock = await this.provider.getBlock("latest");
      const currHour = Math.floor(currBlock.timestamp / 3600) * 3600;
      const dispatchedOffers = await this.poolmarketContractInstance.getDispatchedOffers(currHour);
      return dispatchedOffers;
    }
}
