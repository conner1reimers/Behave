import React, { useState, useCallback, useEffect } from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import First from './first/First';
import './styles/base.scss';
import { AuthContext } from './util/context/auth-context';
import Sidebar from './shared/Sidebar/Sidebar';
import HistoryPage from './Components/HistoryPage/HistoryPage';

function App() {
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState(null);


  const [openLogin, setOpenLogin] = useState(false);
  const [isOnSignupMode, setIsonSignup] = useState(false);
  const [ontoNextSignup, setOntoNextSignup] = useState(false);

  
  const login = useCallback((uid, token) => {
      setToken(token);
      setUserId(uid);

      localStorage.setItem(
        'userData',
        JSON.stringify({ userId: uid, token: token})
      )
    },[]);

  const logout = useCallback(() => {
      setToken(null);
      setUserId(null);

      localStorage.removeItem('userData')
    },[]);

  // const checkHome = () => {
    
  // }

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('userData'));
    if (storedData && storedData.token) {
      login(storedData.userId, storedData.token)
    }
    // checkHome();
  },[])

  const toggleLogin = (event) => {
    if(!!token) {
        logout()
    } else {
        setOpenLogin(!openLogin)
        setIsonSignup(false)
        setOntoNextSignup(false)
    }
    
  }
    
  const home = userId 
  ? (
    <Route path="/:userId/home" exact>
      <First 
      ontoNextSignup={ontoNextSignup}
      setOntoNextSignup={setOntoNextSignup}
      setIsonSignup={setIsonSignup}
      openLogin={openLogin} 
      isOnSignupMode={isOnSignupMode} 
      toggleLogin={toggleLogin}
      setOpenLogin={setOpenLogin}/>
    </Route>

  ) 
  : (
    <Route path="/" exact>
       <First 
      ontoNextSignup={ontoNextSignup}
      setOntoNextSignup={setOntoNextSignup}
      setIsonSignup={setIsonSignup}
      openLogin={openLogin} 
      isOnSignupMode={isOnSignupMode} 
      toggleLogin={toggleLogin}
      setOpenLogin={setOpenLogin}/>
    </Route>
  );

  const reDirect = userId ? <Redirect to={`/${userId}/home`} /> : <Redirect to='/' />

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        userId,
        token,
        login,
        logout,
      }}
    >
      <div className="container">

        <BrowserRouter>
        <Sidebar toggle={toggleLogin} />
          
            <Switch>

              {home}
              
              <Route path={`/${userId}/history`} exact>
                <HistoryPage/>
              </Route>
              
              {reDirect}

            </Switch>
            
        </BrowserRouter>

      </div>
    </AuthContext.Provider>
  );
}

export default App;
