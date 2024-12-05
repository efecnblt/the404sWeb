import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './styles/index.scss'
import {AuthProvider} from "./firebase/AuthContext.tsx";
import {LoadingProvider} from "./LoadingContext.tsx";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <AuthProvider>
          <LoadingProvider>
            <App />
          </ LoadingProvider>
      </AuthProvider>
  </StrictMode>,
)
