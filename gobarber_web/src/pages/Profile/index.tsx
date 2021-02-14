import React, { useCallback, useRef } from 'react';

import {
  FiMail,
  FiLock,
  FiUser,
  FiCamera,
  FiArrowLeft,
} from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import { Link, useHistory } from 'react-router-dom';

import api from '../../services/api';
import getValidationErrors from '../../utils/getValidationErrors';

import {
  Container,
  Content,
  AvatarInput,
} from './styles';

import Input from '../../components/Input';
import Button from '../../components/Button';
import { useToast } from '../../hooks/toast';
import { useAuth } from '../../hooks/auth';

interface ProfileFormData {
  name: string;
  email: string;
  password: string;
}

const Profile: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const history = useHistory();
  const { user } = useAuth();

  const handleSubmit = useCallback(async (data: ProfileFormData) => {
    try {
      formRef.current?.setErrors({});
      const schema = Yup.object().shape({
        name: Yup.string().required('Nome obrigatório'),
        email: Yup.string().required('E-mail obrigatório').email('Digite um e-mail válido'),
        password: Yup.string().min(6, 'No mínimo 6  dígitos'),
      });

      await schema.validate(data, { abortEarly: false });

      await api.post('/users', data);

      addToast({
        type: 'success',
        title: 'Cadastro realizado!',
        description: 'Você já pode fazer seu logon no GoBarber',
      });

      history.push('/');
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errors = getValidationErrors(err);

        formRef.current?.setErrors(errors);

        return;
      }

      addToast({
        type: 'error',
        title: 'Erro na autenticação',
        description: 'Ocorreu um erro ao fazer cadastro, tente novamente',
      });
    }
  }, [addToast, history]);

  return (
    <Container>
      <header>
        <div>
          <Link to="/dashboard">
            <FiArrowLeft size="24" />
          </Link>
        </div>
      </header>
      <Content>
        <Form
          ref={formRef}
          initialData={{
            name: user.name,
            email: user.email,
          }}
          onSubmit={handleSubmit}
        >
          <AvatarInput>
            <img src={user.avatar_url} alt={user.name} />
            <button type="button">
              <FiCamera size="20" />
            </button>
          </AvatarInput>

          <h1>Meu Perfil</h1>

          <Input
            icon={FiUser}
            type="text"
            name="name"
            id="name"
            placeholder="Nome"
          />
          <Input
            icon={FiMail}
            type="text"
            name="email"
            id="email"
            placeholder="E-mail"
          />

          <Input
            containerStyle={{ marginTop: 24 }}
            icon={FiLock}
            type="old_password"
            name="old_password"
            id="old_password"
            placeholder="Senha Atual"
          />
          <Input
            icon={FiLock}
            type="password"
            name="password"
            id="password"
            placeholder="Nova Senha"
          />
          <Input
            icon={FiLock}
            type="password_confirmation"
            name="password_confirmation"
            id="password_confirmation"
            placeholder="Confirmar Senha"
          />

          <Button type="submit">Confirmar mudanças</Button>
        </Form>

      </Content>
    </Container>
  );
};

export default Profile;
