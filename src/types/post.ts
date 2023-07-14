/*
    In case you need to add a new type, e.g. post that also needs to be stored on the database, you can add it here.

    This file is just an example, you can delete it if you don't need it.
*/

export type post = {
  id?: number;
  title: string;
  content: string;
  author: string;
};
