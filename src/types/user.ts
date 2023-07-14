import { z } from 'zod';

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

// used to check the data coming from the client
export const userSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(3).max(255),
  role: z.nativeEnum(Role),
  password: z.string().min(4),
  email: z.string().email(),
});
