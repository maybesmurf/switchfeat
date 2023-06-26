import passport from "passport";
import { Request, Response, NextFunction, Express } from "express";
import * as userService from "../../services/usersService";
import { googleStrategy } from "./googleAuth";
import { keys } from "@switchfeat/core";


export const initialise = (app: Express) => {

  app.use(passport.initialize());

  // serialize the user.id to save in the cookie session
  // so the browser will remember the user when login
  passport.serializeUser<any, any>((_req, user, done) => {
    done(null, user);
  });

  // deserialize the cookieUserId to user in the database
  passport.deserializeUser(async (id: string, done) => {
    var currentUser = await userService.getUser({ userId: id });
    done(currentUser === null ? "user not found." : null, { user: currentUser });
  });

  if (!!keys.GOOGLE_CLIENT_ID) {
    console.log("aaaaa");
    passport.use(googleStrategy);
  }
};




export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/");
};


