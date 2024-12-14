export class Feed {
  public id?: bigint;
  public content: string;
  public user_id: bigint;
  public created_at?: Date;
  public updated_at?: Date;

  constructor(
    content: string,
    user_id: number | bigint,
    id?: number | bigint,
    created_at?: Date,
    updated_at?: Date
  ) {
    this.id = id === undefined ? id : BigInt(id);
    this.content = content;
    this.user_id = BigInt(user_id);
    this.created_at = created_at;
    this.updated_at = updated_at;
  }
}
