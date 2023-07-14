import { z } from 'zod';

export type user = z.infer<typeof userSchema>;

export enum Role {
  Admin = 'admin',
  User = 'user',
}

// used to check the data coming from the client
export const userSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(3).max(255),
  role: z.nativeEnum(Role),
  password: z.string().min(4),
  email: z.string().email(),
});
