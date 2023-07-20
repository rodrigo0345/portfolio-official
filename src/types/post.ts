/*
    In case you need to add a new type, e.g. post that also needs to be stored on the database, you can add it here.

    This file is just an example, you can delete it if you don't need it.
*/

import { z } from "zod";

export const postSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(3).max(255),
  content: z.string().min(4),
  category: z.string().min(3).max(255),
  image: z.string().min(4),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
});

export type post = z.infer<typeof postSchema>;
