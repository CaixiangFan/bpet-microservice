import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import { SignerService } from './shared/services/signer/signer.service';
import * as RegistryContractAbi from 'src/contracts/Registry.sol/Registry.json';
// import { ApproveRequest } from './approve-request.dto';
// import { TokenRequest } from './token-request.dto';


@Injectable()
export class AppService {
  registryContractInstance: ethers.Contract;
  // adminAddress: string;

  constructor(private signerService: SignerService) {
    const registryContractAddress = process.env.REGISTRY_CONTRACT_ADDRESS;
    if (!registryContractAddress || registryContractAddress.length === 0) return;
    // this.adminAddress = signerService.signer.address;
    this.registryContractInstance = new ethers.Contract(
      registryContractAddress,
      RegistryContractAbi,
      this.signerService.signer
    );
  }

  getHello(): string {
    return 'Hello World!';
  }

  async isRegisteredSupplier(account: string) {
    const _isRegisteredSupplier = await this.registryContractInstance.isRegisteredSupplier(account);
    return _isRegisteredSupplier;
  }

  async isRegisteredConsumer(account: string) {
    const _isRegisteredConsumer = await this.registryContractInstance.isRegisteredConsumer(account);
    return _isRegisteredConsumer;
  }

  async getSupplier(account: string) {
    const _supplier = await this.registryContractInstance.getSupplier(account);
    return _supplier;
  }

  async getConsumer(account: string) {
    const _consumer = await this.registryContractInstance.getConsumer(account);
    return _consumer;
  }
}
