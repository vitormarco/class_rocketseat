import React, {
  ChangeEvent,
  useCallback,
  useRef,
} from 'react';

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
  old_password: string;
  password: string;
  password_confirmation: string;
}

const Profile: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const history = useHistory();
  const { user, updateUser } = useAuth();

  const handleSubmit = useCallback(async (data: ProfileFormData) => {
    try {
      formRef.current?.setErrors({});
      const schema = Yup.object().shape({
        name: Yup.string().required('Nome obrigatório'),
        email: Yup.string().required('E-mail obrigatório').email('Digite um e-mail válido'),
        password: Yup.string(),
        old_password: Yup.string().when('password', {
          is: (val: string) => !!val.length,
          then: Yup.string().required('Campo obrigatório'),
          otherwise: Yup.string(),
        }),
        password_confirmation: Yup.string()
          .when('password', {
            is: (val: string) => !!val.length,
            then: Yup.string().required('Campo obrigatório').min(6, 'No mínimo 6  dígitos'),
            otherwise: Yup.string(),
          })
          .oneOf(
            [Yup.ref('password'), null], 'Confirmação incorreta',
          ),
      });

      await schema.validate(data, { abortEarly: false });

      const {
        email,
        name,
        password,
        password_confirmation,
        old_password,
      } = data;

      const formData = {
        name,
        email,
        ...old_password && {
          password,
          password_confirmation,
          old_password,
        },
      };

      const response = await api.put('/profile', formData);

      updateUser(response.data);

      addToast({
        type: 'success',
        title: 'Perfil atualizado!',
        description: 'Informações atualizada com sucesso',
      });

      history.push('/dashboard');
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errors = getValidationErrors(err);

        formRef.current?.setErrors(errors);

        return;
      }

      addToast({
        type: 'error',
        title: 'Erro na autenticação',
        description: err?.response?.data?.message,
      });
    }
  }, [addToast, history, updateUser]);

  const handleAvatarChange = useCallback(async (e: ChangeEvent<HTMLInputElement>) => {
    try {
      if (e.target.files) {
        const formData = new FormData();

        formData.append('avatar', e.target.files[0]);
        const { data } = await api.patch('/users/avatar', formData);
        updateUser(data);

        addToast({
          type: 'success',
          title: 'Avatar atualizado!',
        });
      }
    } catch (err) {
      addToast({
        type: 'success',
        title: 'Ocorreu um erro ao atualizar o avatar.',
        description: err?.response?.data?.message,
      });
    }
  }, [addToast, updateUser]);

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
            <label htmlFor="avatar">
              <FiCamera size="20" />
              <input type="file" name="avatar" id="avatar" onChange={handleAvatarChange} />
            </label>
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
            type="password"
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
            type="password"
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
