import model, { User } from "../models/user";

const {
  getUsers: getUsersModel,
  addUser,
  getUserById: getUserByIdModel,
  getUserByEmail: getUserByEmailModel,
  deleteUser: deleteUserModel,
  updateUser: updateUserModel,
} = model;

import { Request, Response, NextFunction } from "express";

function getUsers(req: Request, res: Response, next: NextFunction) {
  getUsersModel().then((users: User) => res.json(users));
}

function getUserById(req: Request, res: Response, next: NextFunction) {
  getUserByIdModel(req.params.userId).then((users: User[]) => {
    res.status(users ? 200 : 404).json(
      users
        ? users
        : {
            message: "No user found",
          }
    );
  });
}

function deleteUser(req: Request, res: Response, next: NextFunction) {
  deleteUserModel(req.params.userId).then((deletedUser: any) => {
    res
      .status(deletedUser ? 202 : 404)
      .json(deletedUser ? deletedUser : { message: "User not found" });
  });
}

async function createNewUser(req: Request, res: Response, next: NextFunction) {
  const body = req.body;

  if (!body.name)
    return res.status(400).json({ message: "Your name is required" });
  if (body.name.length < 3)
    return res.status(400).json({ message: "Your name is too short" });
  if (!body.age)
    return res.status(400).json({ message: "Your age is required" });
  if (body.age < 15)
    return res.status(400).json({ message: "You are too young" });
  if (!body.email)
    return res.status(400).json({ message: "Your email is required" });
  if (body.email.length < 3 || body.email.indexOf("@") === -1)
    return res.status(400).json({ message: "Your email is invalid" });
  if (!body.password)
    return res.status(400).json({ message: "Your password is required" });
  if (body.password.length < 8)
    return res.status(400).json({ message: "Your password is too short" });

  if (await getUserByEmailModel(body.email))
    return res.status(400).json({ message: "This email is already used" });

  await addUser(body).then((user: User) => {
    res.json(user);
  });
}

function updateUser(req: Request, res: Response, next: NextFunction) {
  const body = req.body;

  if (body.name && body.name.length < 3)
    return res.status(400).json({ message: "Your name is too short" });
  if (body.age && body.age < 15)
    return res.status(400).json({ message: "You are too young" });
  if (body.password && body.password.length < 8)
    return res.status(400).json({ message: "Your password is too short" });

  updateUserModel(req.params.userId, body).then(
    (updatedUser: User | undefined) => {
      res
        .status(updatedUser ? 200 : 404)
        .json(updatedUser ? updatedUser : { message: "No user found" });
    }
  );
}

export { getUsers, getUserById, createNewUser, deleteUser, updateUser };
