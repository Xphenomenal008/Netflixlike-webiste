import dotenv from "dotenv";
dotenv.config(); //now we can user environment varibles stored in .env file;
  
export const ENV_VARS={
    MONGO_URI:process.env.MONGO_URI,
    PORT:process.env.PORT || 3000,
    JWTSECRET:process.env.JWT_SECRET || "your_default_secret",
    NODEENV:process.env.NODEENV
}


