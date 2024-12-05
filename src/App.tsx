
import { HelmetProvider } from 'react-helmet-async'
import AppNavigation from './navigation/Navigation'
import { Provider } from 'react-redux'
import store from './redux/store'
import {useAuth} from "./firebase/AuthContext.tsx";
import {Mosaic} from "react-loading-indicators";

function App() {
    const { loading } = useAuth();

    if (loading) {
        return (
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh",
                    backgroundColor: "#f9f9f9",
                }}
            >
                <Mosaic color={["#33CCCC", "#33CC36", "#B8CC33", "#FCCA00"]} />
            </div>
        );
    }


  return (
    <Provider store={store}>

      <HelmetProvider>
        <div className="main-page-wrapper">
                <AppNavigation />
        </div>
      </HelmetProvider>
    </Provider>
  )
}

export default App
