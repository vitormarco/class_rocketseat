import React from 'react';

import { FiChevronRight } from 'react-icons/fi';
import logoImg from '../../assets/logo.svg';

import { Title, Form, Repositories } from './styles';

const Dashboard: React.FC = () => {
  return (
    <>
      <img src={logoImg} alt="Github Explore" />
      <Title>Explore repositórios no Github</Title>
      <Form>
        <input placeholder="Digite o nome do repositório" />
        <button type="submit">Pesquisar</button>
      </Form>

      <Repositories>
        <a href="teste">
          <img
            src="https://avatars1.githubusercontent.com/u/31700114?s=460&u=2b889643a8867d50d688453c76aebe18c095d1ce&v=4"
            alt="Vítor Marco"
          />
          <div>
            <strong>rocketseat/unform</strong>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
              eleifend lacus vel urna varius, eu bibendum nisl commodo.
            </p>
          </div>
          <FiChevronRight size={50} />
        </a>
        <a href="teste">
          <img
            src="https://avatars1.githubusercontent.com/u/31700114?s=460&u=2b889643a8867d50d688453c76aebe18c095d1ce&v=4"
            alt="Vítor Marco"
          />
          <div>
            <strong>rocketseat/unform</strong>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
              eleifend lacus vel urna varius, eu bibendum nisl commodo.
            </p>
          </div>
          <FiChevronRight size={50} />
        </a>
        <a href="teste">
          <img
            src="https://avatars1.githubusercontent.com/u/31700114?s=460&u=2b889643a8867d50d688453c76aebe18c095d1ce&v=4"
            alt="Vítor Marco"
          />
          <div>
            <strong>rocketseat/unform</strong>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
              eleifend lacus vel urna varius, eu bibendum nisl commodo.
            </p>
          </div>
          <FiChevronRight size={50} />
        </a>
      </Repositories>
    </>
  );
};

export default Dashboard;
