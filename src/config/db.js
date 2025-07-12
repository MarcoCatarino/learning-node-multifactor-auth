import { connect } from "mongoose";

import { ENV } from "./env.js";

export const dbConnect = async () => {
  try {
    await connect(ENV.MONGO_URI);
    console.log(`Database connected ✅`);
  } catch (error) {
    console.error({ error: `Error conecting DB` });
    process.exit(1);
  }
};
