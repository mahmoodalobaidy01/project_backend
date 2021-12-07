import { sign } from "jsonwebtoken";
import { validationResult } from "express-validator";
import { NextFunction, Request, Response } from "express";

import model from "../../user/models/user";
const {
  addUser,
  getUserByCredentials,
  getUserByEmail: getUserByEmailModel,
} = model;
import { formatBodyErrorsResponse } from "../../shared/formatResponse";

export async function login(req: Request, res: Response, next: NextFunction) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: formatBodyErrorsResponse(errors) });
  }

  const body = req.body;

  const user = await getUserByCredentials(body);

  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  // console.log(process.env.directTokenExpiryTime, +process.env.directTokenExpiryTime!);

  const token = sign(
    {
      id: user.id,
      privileges: user.privileges,
    },
    `${process.env.secret}`,
    {
      expiresIn: +process.env.directTokenExpiryTime!,
    }
  );
  res.json({
    id: user.id,
    privileges: user.privileges,
    token,
  });
}

export async function signup(req: Request, res: Response, next: NextFunction) {
  const body = req.body;

  if (!body.email)
    return res.status(400).json({ message: "Your email is required" });
  if (body.email.length < 3 || body.email.indexOf("@") === -1)
    return res.status(400).json({ message: "Your email is invalid" });
  if (!body.password)
    return res.status(400).json({ message: "Your password is required" });
  if (body.password.length < 8)
    return res.status(400).json({ message: "Your password is too short" });
  if (!body.name)
    return res.status(400).json({ message: "Your name is required" });
  if (body.name.length < 3)
    return res.status(400).json({ message: "Your name is too short" });
  if (!body.age)
    return res.status(400).json({ message: "Your age is required" });
  if (body.age < 15)
    return res.status(400).json({ message: "You are too young" });

  if (await getUserByEmailModel(body.email))
    return res.status(400).json({ message: "This email is already used" });

  const user = await addUser(body);
  const token = sign(
    {
      id: user.id,
      privileges: user.privileges,
    },
    `${process.env.secret}`,
    {
      expiresIn: eval(process.env.tokenExpiryTime!),
    }
  );
  res.json({
    message: "user successfully created",
    privileges: user.privileges,
    id: user.id,
    token,
  });
}
