import { User } from "../models/user.model";

export interface UserRepository {
  findById(id: number): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByUsername(username: string): Promise<User | null>;
  create(user: User): Promise<User>;
  update(user: User): Promise<User>;
  save(user: User): Promise<User>;
  searchUsers(keyword: string): Promise<User[]>; 
}
