import React, { useState, useCallback, useEffect, memo, useMemo, useRef } from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import First from './first/First';
import './styles/base.scss';
import { AuthContext } from './util/context/auth-context';
import Sidebar from './shared/Sidebar/Sidebar';
import HistoryPage from './Components/HistoryPage/HistoryPage';
import Features from './shared/Firstpage components/Features';
import NewPage from './Components/Experiment/NewPage';

const App = React.memo(() => {
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState(null);


  const [openLogin, setOpenLogin] = useState(false);


  const [budgetState, setBudgetState] = useState(false);

  const passData = (passed) => {
    setBudgetState(passed);
  }
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


  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('userData'));
    if (storedData && storedData.token) {
      login(storedData.userId, storedData.token)
    }
    // checkHome();
  }, []);

  const toggleLogin = useCallback((event) => {
    if(!!token) {
        logout()
    } else {
        setOpenLogin((prevState) => !prevState)

    }
    
  }, [])


    
  const home = userId 
  ? (
    <Route path="/:userId/home" exact>
      <First 

      openLogin={openLogin} 
      toggleLogin={toggleLogin}
      setOpenLogin={setOpenLogin}
      passData={passData}
      />
    </Route>

  ) 
  : (
    <Route path="/" exact>
       <First 

      openLogin={openLogin} 
      toggleLogin={toggleLogin}
      setOpenLogin={setOpenLogin}
      passData={passData}
      />
    </Route>
  ); 

  const reDirect = userId ? <Redirect to={`/${userId}/home`} /> : <Redirect to='/' />
  const renders = useRef(0);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        userId,
        token,
        login,
        logout,
        budget: budgetState
      }}
    >
      <div className="container">

            {/* <div className="app-renders">renders: {renders.current++}</div> */}

        <BrowserRouter>
        <Sidebar isLoggedIn={!!token} userId={userId} toggle={toggleLogin} />
          
            <Switch>

              {home}
              
              <Route path={`/${userId}/history`} exact>
                <HistoryPage
                  budget={budgetState}
                />
              </Route>

              <Route path={`/${userId}/todo`} exact>
                <Features />
              </Route>
              <Route path={`/${userId}/newpage`} exact>
                <NewPage/>
              </Route>

              {reDirect}

            </Switch>
            
        </BrowserRouter>

      </div>
    </AuthContext.Provider>
  );
})

export default App;
