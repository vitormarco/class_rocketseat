import React, { useState } from 'react';

import api from './service/api';

import './App.css'
import backgroundImage from './assets/background.jpg'

import Header from './components/Header';

function App () {
  const [projects, setProjects] = useState(['Desenvolvimento APP', 'Front-end web']);

  const handleAddProject = () => {
    setProjects([ ...projects, `Novo Project ${Date.now()}`]);
  }

  return (
    <>
      <Header title="Projects" />

      <img width={300} src={backgroundImage} />

      <ul>
        { projects.map((project, index) => <li key={`list_${index}`}>{ project }</li>) }
      </ul>

      <button type="button" onClick={handleAddProject}>Adicionar projeto</button>
    </>
  );
}

export default App;