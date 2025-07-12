import express, { json, urlencoded } from "express";
import session from "express-session";
import passport from "passport";
import cors from "cors";

import { ENV } from "./config/env.js";
import { dbConnect } from "./config/db.js";
import "./config/passportConfig.js";

import authRoutes from "./routes/authRoutes.route.js";

const app = express();

//todo: Middlewares

// * Cors Middleware
const corsOptions = {
  origin: ["http://localhost:3001"], //? <- Here it's the PORT of our frontend
  credentials: true,
};
app.use(cors(corsOptions));

// * Express Middleware
app.use(json({ limit: "100mb" }));
app.use(urlencoded({ limit: "100mb", extended: true }));

// * Session Middleware
app.use(
  session({
    secret: ENV.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 6000 * 60,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

//todo: Routes
app.use("/api/auth", authRoutes);

//todo: Server Listen
app.listen(ENV.PORT, () => {
  try {
    dbConnect();

    console.log(`Server in PORT: ${ENV.PORT}`);
  } catch (error) {
    console.error({ error: "Server Error!" });
  }
});
