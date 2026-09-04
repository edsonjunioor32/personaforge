import React from 'react';
import { createRoot } from 'react-dom/client';
import PersonaForge from '../app/page';
import '../app/globals.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Elemento raiz do PersonaForge não encontrado.');
}

createRoot(rootElement).render(
  <React.StrictMode>
    <PersonaForge />
  </React.StrictMode>,
);
