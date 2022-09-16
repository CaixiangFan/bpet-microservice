export class RegistryRequest {
  constructor(
    public action: string,
    public account: string,
    public amount: number,
  ) {}
}