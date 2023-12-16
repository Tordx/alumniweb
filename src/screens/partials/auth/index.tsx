import { collection, getDocs } from '@firebase/firestore';
import { auth, db } from '../../../firebase';
import React, { useContext, useEffect, useState } from 'react'
import { signInWithEmailAndPassword } from "firebase/auth";
import { Link, useNavigate } from 'react-router-dom';
import '../styles/auth.css'
import { AuthContext } from 'auth';
import { logindata } from 'types/interfaces';
import { LoginFields } from 'screens/components/global/fields';
import { faLock, faUser } from '@fortawesome/free-solid-svg-icons';
export default function Login({}) {

  const [loginemail, setloginEmail] = useState('');
  const [loginpassword, setloginPassword] = useState('');
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate()

  useEffect(() => {
    const getUserData = async () => {
   try {
 
     const querySnapshot = await getDocs(collection(db, 'user'));
     querySnapshot.forEach((doc: any) => {
       // console.log(doc.id, ' => ', doc.data());
     });
   } catch (error) {
     console.log(error);
     console.log('Error getting user documents: ', error);
   }
 };
 
 getUserData();
   if(currentUser != null){
     navigate("/alumni/news");
   }
   }, [currentUser]);

   const checkStatus = async (e: any) => {
    e.preventDefault()
    const querySnapshot = await getDocs(collection(db, "user"));
    const userData: logindata[] = [];
  
    querySnapshot.forEach((doc) => {
      if (doc.data().email === loginemail) {
        userData.push({
            uid: doc.data().uid,
            username: doc.data().username,
            password: doc.data().password,
            newpassword: doc.data().newpassword,
            confirmpassword: doc.data().confirmpassword,
            type: doc.data().type,
            
        });
      }
    });
    
    if (userData.length > 0) {
      const isAdmin = userData.some((user) => user.type === "alumni");
      console.log(isAdmin);
      if (isAdmin) {
        const email = loginemail;
        const password = loginpassword;
        await signInWithEmailAndPassword(auth, email, password).then(() => {
          navigate("/alumni/news");
        }).catch((error: any) => {
          console.log(error)
          alert('something went wrong')
        })
      } else {
        alert("The provided email does not exists user.");
      }
    } else {
      alert("no matches found with the email and password provided.");
    }
  }

  return (
    <div draggable = {false} className="container">
      <img draggable = {false} src="https://i.imgur.com/mzylrqX.png" alt="Your Image"/>
      <div className="image-overlay">
        <div className='login-box'>
          <span className='image-container'>
            <img className='logo' src ='https://i.imgur.com/4ywrjZF.png' />
            <img className='logo'  src='https://i.imgur.com/5CH306W.png'/>
          </span>
          <h1>Login to your Account</h1>
          <LoginFields 
            title = 'email address *'
            icon = {faUser}
            value={loginemail}
            placeholder='email address'
            disabled = {false}
            onChange={(e) => setloginEmail(e.target.value)} 
          />
          <LoginFields 
            title = 'password *'
            icon = {faLock}
            value={loginpassword}
            placeholder='password'
            disabled = {false}
            onChange={(e) => setloginPassword(e.target.value)} 
          />
          <a>Forgot password?</a>
          <button onClick={checkStatus}>Login</button>
        </div>
      </div>
    </div>
  )
}