import React, { useCallback } from 'react';

import {
  FiArrowLeft, FiMail, FiLock, FiUser,
} from 'react-icons/fi';
import { Form } from '@unform/web';
import * as Yup from 'yup';

import logoImg from '../../assets/logo.svg';

import { Container, Content, Background } from './styles';

import Input from '../../components/Input';
import Button from '../../components/Button';

const SignUp: React.FC = () => {
  const handleSubmit = useCallback(async (data: object) => {
    try {
      const schema = Yup.object().shape({
        name: Yup.string().required('Nome obrigatório'),
        email: Yup.string().required('E-mail obrigatório').email('Digite um e-mail válido'),
        password: Yup.string().min(6, 'Senha no mínimo 6  dígitos'),
      });

      await schema.validate(data, { abortEarly: false });
    } catch (err) {
      console.log({ err });
    }
  }, []);

  return (
    <Container>
      <Background />
      <Content>
        <img src={logoImg} alt="GoBarber" />
        <Form onSubmit={handleSubmit}>
          <h1>Faça seu cadastro</h1>

          <Input icon={FiUser} type="text" name="name" id="name" placeholder="Nome" />
          <Input icon={FiMail} type="text" name="email" id="email" placeholder="E-mail" />
          <Input icon={FiLock} type="password" name="password" id="password" placeholder="Senha" />

          <Button type="submit">Cadastrar</Button>
        </Form>

        <a href="http://">
          <FiArrowLeft />
          Voltar para logon
        </a>
      </Content>
    </Container>
  );
};

export default SignUp;
