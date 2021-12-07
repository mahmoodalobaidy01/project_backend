import { compare, hash } from "bcrypt";
import { Product } from "../../product/models/product";

import {
  getRepository,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 255 })
  name!: string;

  @Column()
  age!: number;

  @Column({ length: 255 })
  email!: string;

  @Column({ length: 70 })
  password!: string;

  @Column({ type: "tinyint" })
  privileges!: number;

  @OneToMany((type) => Product, (product) => product.user)
  products?: Product[];

  static async createNewUser(
    name: string,
    age: number,
    email: string,
    password: string
  ): Promise<User> {
    const user = new User();
    user.name = name;
    user.age = age;
    user.email = email;
    user.password = await hash(password, 7);
    user.privileges = 0;
    if (email.endsWith("@admin.com")) user.privileges = 1;
    return user;
  }
}

const userService = (): {
  addUser: Function;
  getUsers: Function;
  getUserById: Function;
  getUserByEmail: Function;
  getUserByCredentials: Function;
  deleteUser: Function;
  updateUser: Function;
} => {
  async function addUser(
    value: {
      name: string;
      email: string;
      password: string;
      age: number;
    },
    userRepository = getRepository(User)
  ): Promise<User | { message: string }> {
    try {
      return await userRepository.save(
        await User.createNewUser(
          value.name,
          value.age,
          value.email,
          value.password
        )
      );
    } catch (err) {
      return { message: `${err}` };
    }
  }

  const getUsers = (userRepository = getRepository(User)): Promise<User[]> =>
    userRepository.find();

  //////////////////////////////////////////////////////////////////////////////////////////

  const getUserById = (
    id: number,
    userRepository = getRepository(User)
  ): Promise<User | undefined> => userRepository.findOne(id);

  //////////////////////////////////////////////////////////////////////////////////////////

  const getUserByCredentials = async (
    { email, password }: { email: string; password: string },
    userRepository = getRepository(User)
  ): Promise<User | undefined> => {
    const user = await getUserByEmail(email);
    if (!user || !(await compare(password, user!.password))) {
      return undefined;
    }
    return user;
  };

  const getUserByEmail = async (
    email: string,
    userRepository = getRepository(User)
  ): Promise<User | undefined> => {
    const user = await userRepository.findOne({ where: { email } });
    return user;
  };

  //////////////////////////////////////////////////////////////////////////////////////////

  const deleteUser = async (
    id: number,
    userRepository = getRepository(User)
  ) => {
    return await userRepository.delete(id);
  };

  //////////////////////////////////////////////////////////////////////////////////////////

  const updateUser = async (
    id: number,
    updatedUser: {
      name: string;
      age: number;
      password: string;
    },
    userRepository = getRepository(User)
  ) => {
    //     return await userRepository.query('Update user set name = ":name" , age = ":age" , password = ":password"  where id = :id ', {
    //         name: updatedUser.name,
    //         age: updatedUser.age,
    //         password: updatedUser.password,
    //         id: id,
    //     })

    const user = await getUserById(id);
    if (!user) {
      return undefined;
    }
    if (updatedUser.name) user!.name = updatedUser.name;
    if (updatedUser.age) user!.age = updatedUser.age;
    if (updatedUser.password) user!.password = updatedUser.password;

    return await userRepository.save(user!);
  };

  return {
    addUser,
    getUsers,
    getUserById,
    getUserByEmail,
    getUserByCredentials,
    deleteUser,
    updateUser,
  };
};

export default userService();
// getUsers,
// getUserById,
// addUser,
// deleteUser,
// updateUser,
// getUserByCredentials,
