import {useEffect, useState} from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import AllRoutes from "./components/AllRoutes/AllRoutes.jsx";
import {useDispatch} from "react-redux";
import authService from "./services/authService.js";
import {setLoginSuccess} from "./redux/actions/authAction.js";
import {Layout, Spin} from "antd";

function App() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
      const verifySession = async () => {
          try {
              const response = await authService.checkSession();

              if (response.ok && response.data.user) {
                  dispatch(setLoginSuccess(response.data.user));
              }
          }
          catch(error) {
              console.log("No active session found.");
          }
          finally {
              setLoading(false);
          }
      }

      verifySession();
  }, [dispatch]);

  if (loading) {
      return (
          <Layout style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Spin size="large" />
          </Layout>
      );
  }

  return (
    <>
      <AllRoutes />
    </>
  )
}

export default App
