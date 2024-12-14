export class Connection {
    public from_id: bigint;
    public to_id: bigint;
    public created_at: Date;
    
    constructor(from_id: bigint, to_id: bigint, created_at: Date) {
        this.from_id = from_id;
        this.to_id = to_id;
        this.created_at = created_at;
    }
}

export class ConnectionRequest {
    public from_id: bigint;
    public to_id: bigint;
    public created_at: Date;
    
    constructor(from_id: bigint, to_id: bigint, created_at: Date) {
        this.from_id = from_id;
        this.to_id = to_id;
        this.created_at = created_at;
    }
}
