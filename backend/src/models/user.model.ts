export class User {
  public id?: bigint;
  public username: string;
  public email: string;
  public password_hash: string;
  public profile_photo_path: string;
  public created_at?: Date;
  public updated_at?: Date;
  public work_history: string | null;
  public skills: string | null;
  public full_name: string;

  constructor(
    username: string,
    email: string,
    password_hash: string,
    full_name: string,
    profile_photo_path?: string,
    id?: number | bigint,
    created_at?: Date,
    updated_at?: Date,
    skills?: string,
    work_history?: string
  ) {
    this.id = id === undefined ? id : BigInt(id);
    this.username = username;
    this.email = email;
    this.password_hash = password_hash;
    this.full_name = full_name;
    this.work_history = work_history || null;
    this.skills = skills || null;
    this.profile_photo_path =
      profile_photo_path || "/default-profile-picture.jpg";
    this.created_at = created_at;
    this.updated_at = updated_at;
  }
}
