import { JsonValue } from "../constants/types";

export class PushSubscription {
  public endpoint: string;
  public user_id: bigint | null;
  public keys: JsonValue;
  public created_at?: Date;

  constructor(
    endpoint: string,
    keys: JsonValue,
    user_id?: number | bigint | null,
    created_at?: Date
  ) {
    this.endpoint = endpoint;
    this.keys = keys;
    this.user_id = user_id ? BigInt(user_id) : null;
    this.created_at = created_at;
  }
}
