import { PlainUser } from "../repositories/user.repository";

declare global {
  namespace Express {
    interface Request {
      user?: PlainUser;
    }
  }
}
