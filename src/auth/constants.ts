import * as dotenv from "dotenv";
dotenv.config();

export const jwtConstants = {
  secret: process.env.JWT_SECRET,
};

export const bcryptSaltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS);