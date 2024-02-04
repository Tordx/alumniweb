import React, { useContext, useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate, Outlet, Link } from "react-router-dom";
import './App.css';
import { AuthContext } from 'auth';
import { ForgotPassword } from 'screens/partials/auth/forgotpassword';
import { children } from 'types/interfaces';
import Login from 'screens/partials/auth';
import News from 'screens/home/news';
import { Header } from 'screens/components/gen/header';
import Navbarmenu from 'screens/components/gen/navigator/navbarmenu';
import Events from 'screens/home/events';
import Activities from 'screens/home/activities';
import Error from 'screens/partials/Error/Error';
import Account from 'screens/home/details/account';
import Education from 'screens/home/details/education';
import Employment from 'screens/home/details/employment';
import Personal from 'screens/home/details/personal';
import Status from 'screens/home/details/status';
import Logout from 'screens/partials/auth/logout';
import { PublicHeader } from 'screens/components/gen/publicheader';
import NewsLetter from 'screens/components/global/newsletter';


//**NOTE**(((((ONLY USE TSRFC WHEN CREATING NEW SCREENS)))))**NOTE**/

const App: React.FC = () => {
  const { currentUser } = useContext(AuthContext);
  const [isOpen, setIsIOpen] = useState(false);

  const ProtectedRoute: React.FC<children> = ({ children }) => {
    if (currentUser === null) {
      return <Navigate to="/alumni/news" />;
    }

    return children
  };

  React.useEffect(() => {
    newsLetter()
  },[])

  const newsLetter = async() => {
    console.log('this is where website ask you for newsletter')
    const saved: string = localStorage.getItem('newsletter') || '';
    console.log(saved)
    if(saved == '') {
      console.log('newsletter unsubscribed')
      setIsIOpen(true)
    } else {

      console.log('newsletter subscribed')
      return
    }
  }
  return (
    <BrowserRouter>
      {currentUser ? <Header menu={Navbarmenu} /> : <PublicHeader menu={Navbarmenu}  />}
      {isOpen && <NewsLetter isOpen = {isOpen} onClose={() => setIsIOpen(false)} />}
      <Routes>
       <Route  path="/">
          <Route path="login" element={<Login/>} />
          <Route path="forgotpassword" element={<ForgotPassword/>} />
          <Route path='*' element={<Error/>} />
          <Route index element = {<News/>}/>
          <Route path='logout' element = {<Logout/>} />
          
        </Route>
        <Route path = "alumni">
          <Route  path="events" index element={<Events/>}/>
          <Route  path="activities" index element={<Activities/>}/>
          <Route path='news' index element={<News/>}/>
          <Route path='account' index element={ <ProtectedRoute><Account/></ProtectedRoute>}/>
          <Route path='education' index element={ <ProtectedRoute><Education/></ProtectedRoute>}/>
          <Route path='employment' index element={ <ProtectedRoute><Employment/></ProtectedRoute>}/>
          <Route path='personal' index element={ <ProtectedRoute><Personal/></ProtectedRoute>}/>
          <Route path='status' index element={ <ProtectedRoute><Status/></ProtectedRoute>}/>

        </Route>
      </Routes>
    
    </BrowserRouter>
  );
}

export default App;
