import { Request, Response } from 'express';
import createUser from './services/CreateUser';

export function hellowWorld(request: Request, response: Response) {
  const user = createUser({
    email: 'vitor@teste.com',
    password: '1234',
    techs: [
      'Node.js',
      'ReactJS',
      { title: 'Javascript', experience: 70 },
    ]
  });
  
  return response.json({ message: 'Hello World!' });
}