import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './styles/index.scss'
import {AuthProvider} from "./firebase/AuthContext.tsx";
import {LoadingProvider} from "./LoadingContext.tsx";
import {Provider} from "react-redux";
import store from './redux/store'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <Provider store={store}>
      <AuthProvider>
          <LoadingProvider>
            <App />
          </ LoadingProvider>
      </AuthProvider>
      </Provider>
  </StrictMode>,
)
