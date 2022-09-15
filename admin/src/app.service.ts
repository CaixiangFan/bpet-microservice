import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import { SignerService } from './shared/services/signer/signer.service';
import * as TokenContractAbi from 'src/contracts/EnergyToken.sol/EnergyToken.json';
import * as RegistryContractAbi from 'src/contracts/Registry.sol/Registry.json';


@Injectable()
export class AppService {
  tokenContractInstance: ethers.Contract;
  registryContractInstance: ethers.Contract;
  adminAddress: string;

  constructor(private signerService: SignerService) {
    const tokenContractAddress = process.env.TOKEN_CONTRACT_ADDRESS;
    const registryContractAddress = process.env.REGISTRY_CONTRACT_ADDRESS;
    if (!tokenContractAddress || tokenContractAddress.length === 0) return;
    if (!registryContractAddress || registryContractAddress.length === 0) return;
    this.tokenContractInstance = new ethers.Contract(
      tokenContractAddress,
      TokenContractAbi,
      this.signerService.signer
    );
    
    this.adminAddress = signerService.signer.address;
    this.registryContractInstance = new ethers.Contract(
      registryContractAddress,
      RegistryContractAbi,
      this.signerService.signer
    );
  }
  getHello(): string {
    return 'Hello World!';
  }

  async getBalance(account: string) {
    try {
      const balanceBN = await this.tokenContractInstance.balanceOf(account);
      const decimals = await this.tokenContractInstance.decimals();
      const balance = Math.round(+ethers.utils.formatEther(balanceBN) * 10 ** decimals);
      return balance;
    } catch (error) {
      console.log(error);
    }
  }

  async getSuppliers() {
    try {
      const registeredSuppliers = await this.registryContractInstance.getAllSuppliers();
      const decimals = await this.tokenContractInstance.decimals();
      let suppliers = [];
      for (let i=0; i<registeredSuppliers.length; i++) {
        const supplier = await this.registryContractInstance.getSupplier(registeredSuppliers[i]);
        const _allowance = await this.tokenContractInstance.allowance(this.adminAddress, registeredSuppliers[i]);
        const allowance = Math.round(+ethers.utils.formatEther(_allowance) * 10 ** decimals);
        suppliers.push({
          id: i+1, 
          account: supplier.account,
          assetId: supplier.assetId,
          allowance,
          blockAmount: supplier.blockAmount,
          capacity: supplier.capacity,
          offerControl: supplier.offerControl
        });
      }
      return suppliers;
    } catch(error) {
      console.log(error);
    }
  }

  async getConsumers() {
    try {
      const registeredConsumers = await this.registryContractInstance.getAllConsumers();
      const decimals = await this.tokenContractInstance.decimals();
      let consumers = [];
      for (let i=0; i<registeredConsumers.length; i++) {
        const consumer = await this.registryContractInstance.getConsumer(registeredConsumers[i]);
        const _allowance = await this.tokenContractInstance.allowance(this.adminAddress, registeredConsumers[i]);
        const allowance = Math.round(+ethers.utils.formatEther(_allowance) * 10 ** decimals);
        consumers.push({
          id: i+1, 
          account: consumer.account,
          assetId: consumer.assetId,
          allowance,
          load: consumer.load,
          offerControl: consumer.offerControl
        });
      }
      return consumers;
    } catch(error) {
      console.log(error);
    }
  }

  async approve(account: string, allowance: number) {
    try {
      const tx = await this.tokenContractInstance.approve(account, allowance);
      return tx.hash;
    } catch(error) {
      console.log(error);
    }
  }

  async requestToken(action: string, account: string, amount: number) {
    try {
      if (action === 'mintETK') {
        const tx = await this.tokenContractInstance.mint(account, amount);
        return tx.hash;
      } else if (action === 'burnETK') {
        const tx = await this.tokenContractInstance.burn(amount);
        return tx.hash;
      }
    }catch (error) {
      console.log(error);
    } 
  }
}
