import { sign } from "jsonwebtoken";
import { JsonController, Body, Post, BodyParam } from "routing-controllers";

import { IsEmail, Length } from "class-validator";

import model from "../../user/models/user";
const {
  addUser,
  getUserByCredentials,
  getUserByEmail: getUserByEmailModel,
} = model;

class User {
  @IsEmail()
  email!: string;

  @Length(8)
  password!: string;
}

@JsonController()
export class AuthController {
  @Post("/login")
  async login(@Body({ validate: true }) user: User) {
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //     return { message: formatBodyErrorsResponse(errors) };
    // }

    const body = user;

    const author = await getUserByCredentials(body);

    if (!author) return { message: "Invalid credentials" };

    // console.log(process.env.directTokenExpiryTime, +process.env.directTokenExpiryTime!);

    const token = sign(
      {
        id: author.id,
        privileges: author.privileges,
      },
      `${process.env.secret}`,
      {
        expiresIn: +process.env.directTokenExpiryTime!,
      }
    );
    return {
      id: author.id,
      privileges: author.privileges,
      token,
    };
  }

  @Post("/signup")
  async signup(
    @BodyParam("email", { validate: true }) email: string,
    @BodyParam("password", { validate: true }) password: string,
    @BodyParam("age", { validate: true }) age: number,
    @BodyParam("name", { validate: true }) name: string
  ) {
    if (!email) return { message: "Your email is required" };
    if (email.length < 3 || email.indexOf("@") === -1)
      return { message: "Your email is invalid" };
    if (!password) return { message: "Your password is required" };
    if (password.length < 8) return { message: "Your password is too short" };
    if (!name) return { message: "Your name is required" };
    if (name.length < 3) return { message: "Your name is too short" };
    if (!age) return { message: "Your age is required" };
    if (age < 15) return { message: "You are too young" };

    if (await getUserByEmailModel(email))
      return { message: "This email is already used" };

    const user = await addUser({
      age,
      name,
      password,
      email,
    });
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
    return {
      message: "user successfully created",
      privileges: user.privileges,
      id: user.id,
      token,
    };
  }
}
