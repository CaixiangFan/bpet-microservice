export class Offer {
  constructor(
    public amount: number,
    public price: number,
    public submitMinute: number,
    public supplierAccount: string,
    public isValid: boolean,
  ) {}
}