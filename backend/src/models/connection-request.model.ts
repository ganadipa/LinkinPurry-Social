export class ConnectionRequest {
  public from_id: bigint;
  public to_id: bigint;
  public created_at?: Date;

  constructor(
    from_id: number | bigint,
    to_id: number | bigint,
    created_at?: Date
  ) {
    this.from_id = BigInt(from_id);
    this.to_id = BigInt(to_id);
    this.created_at = created_at;
  }
}
