import { getRepository } from 'typeorm';
import { hash } from 'bcryptjs';

import User from '../models/User';

interface UserRequest {
  name: string;
  email: string;
  password: string;
}

class CreateUserService {
  public async execute({ name, email, password }: UserRequest): Promise<User> {
    const userRepository = getRepository(User);

    const checkUserExists = await userRepository.findOne({
      where: { email },
    });

    if (checkUserExists) {
      throw new Error('Email already exists.');
    }

    const hashedPassword = await hash(password, 8);

    const user = userRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    await userRepository.save(user);

    return user;
  }
}

export default CreateUserService;
