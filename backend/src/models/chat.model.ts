export class Chat {
  public id?: bigint;
  public timestamp?: Date;
  public from_id: bigint;
  public to_id: bigint;
  public message: string;

  constructor(
    from_id: number | bigint,
    to_id: number | bigint,
    message: string,
    id?: number | bigint,
    timestamp?: Date
  ) {
    this.from_id = BigInt(from_id);
    this.to_id = BigInt(to_id);
    this.message = message;
    this.id = id === undefined ? id : BigInt(id);
    this.timestamp = timestamp;
  }
}
