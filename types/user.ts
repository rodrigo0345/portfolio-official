export type user = {
  id?: number;
  name: string;
  role: Role;
  email: string;
  password: string;
};

export enum Role {
  Admin,
  User,
}
