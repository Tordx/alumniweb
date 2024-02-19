import { fetchdata, fetcheducation, fetchnewsletter, fetchpersonaldata } from '../../firebase/function'
import React, { useContext } from 'react'
import { Header } from 'screens/components/gen/header'
import Navbarmenu from 'screens/components/gen/navigator/navbarmenu'
import { educationdata, newsletter, personaldata, postdata } from '../../types/interfaces'
import Data from 'screens/contents/data'
import {onSnapshot,collection, setDoc, doc} from '@firebase/firestore'
import { db } from '../../firebase/index'
import { AuthContext } from 'auth'
import NewsLetter from 'screens/components/global/newsletter'

type Props = {}

export default function News({}: Props) {
  const [data, setdata] = React.useState<postdata[]>([])
  const [school, setschool] = React.useState<string>('')
  const {currentUser} = useContext(AuthContext)
  const [isOpen, setIsIOpen] = React.useState(false);

  React.useEffect(() => {
    console.log('uy')
    const getUser = async() => {
      if(currentUser != null){
        const result: educationdata[] = await fetcheducation(currentUser?.uid) || [];
        const mapSchool: string = result[0].school
        setschool(mapSchool)
        console.log(mapSchool)
        console.log('meron: ',mapSchool)
      } 
    }
    getUser()
  },[currentUser?.uid])
  

  React.useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'post'), (snapshot) => {
      const result: postdata[] = [];
      snapshot.forEach((doc) => {
        const postData = doc.data();
        console.log(school)
          if (postData.active === true && postData.type === 'news' && postData.school === school)
            result.push({
              uid: postData.uid,
              id: postData.postid,
              time: postData.time,
              photo: postData.photo,
              text: postData.text,
              active: postData.active,
              type: postData.type,
              school: postData.school,
            });
      });
      const sortedResult = result.sort((a: postdata, b: postdata) => {
        const getTime = (timestamp: any): number => {
            const dateObject = timestamp && timestamp.toDate();
            return dateObject ? dateObject.getTime() : 0;
        };
    
        const timeA = getTime(b.time);
        const timeB = getTime(a.time);
    
        return timeA - timeB;
      });
    
      console.log(sortedResult)
      setdata(sortedResult)
    });

    return () => unsubscribe();
  }, [school]);

  React.useEffect(() => {
    const newsLetter = async() => {
      if(currentUser != null){
      try {
        const saved: string = localStorage.getItem('newsletter') || '';
        const loggedin: string = localStorage.getItem('loggedin') || '';
        console.log('data: ',loggedin)
        console.log(saved)
        if(loggedin === '"loggedin"'){
          setIsIOpen(true)
        } else {
          console.log('newsletter subscribed')
        }
      } catch (error) {
        console.log(error)
      }
    }
  }
    newsLetter()
  },[currentUser])

  return (
    <div className='container'>
       {isOpen && currentUser && <NewsLetter signed={(e) => setIsIOpen(e)} isOpen = {isOpen} onClose={() => {setIsIOpen(false); 
      localStorage.removeItem('"loggedin"')}} />}
        <img draggable = {false} src="https://i.imgur.com/mzylrqX.png" alt="Your Image"/>
      <div className="image-overlay">
        <div style = {{position: 'absolute', top: '13%'}}>
          {data && data.map((item, index) => (<Data data = {item} />))}
        </div>
      </div>
    </div>
  )
}