import { Db } from "mongodb"; // or your DB type

declare global {
  namespace Express {
    interface Request {
      db?: Db; // or your DB client type
    }
  }
}