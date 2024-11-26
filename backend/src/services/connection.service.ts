import { inject, injectable } from "inversify";
import { ConnectionRepository } from "../interfaces/connection-repository.interface";
import { UserRepository } from "../interfaces/user-repository.interface";
import { CONFIG } from "../ioc/config";

@injectable()
export class ConnectionService {
    constructor(
        @inject(CONFIG.ConnectionRepository)
        private connectionRepository: ConnectionRepository,
        private userRepository: UserRepository
    ) {}
    
    async searchUsers(keyword: string) {
        console.log("conn serv, searching for users with keyword: ", keyword); // debug
        return await this.userRepository.searchUsers(keyword);
    }    

    async getConnections(userId: bigint) {
        return await this.connectionRepository.getConnectionsByUserId(userId);
    }
    
    async sendConnectionRequest(fromId: bigint, toId: bigint) {
        return await this.connectionRepository.createConnectionRequest(fromId, toId);
    }
    
    async respondToConnectionRequest(fromId: bigint, toId: bigint, action: "accept" | "reject") {
        if (action === "accept") {
            await this.connectionRepository.createConnection(fromId, toId);
        }
        await this.connectionRepository.removeConnectionRequest(fromId, toId);
    }
    
    async getConnectionRequests(userId: bigint) {
        return await this.connectionRepository.getConnectionRequests(userId);
    }
    
    async unconnect(fromId: bigint, toId: bigint) {
        return await this.connectionRepository.removeConnection(fromId, toId);
    }  
}
