import { fetchdata, fetcheducation } from '../../firebase/function'
import React, { useContext, useState } from 'react'
import { educationdata, postdata } from '../../types/interfaces'
import Data from 'screens/contents/data'
import {onSnapshot,collection, setDoc, doc} from '@firebase/firestore'
import { db } from '../../firebase/index'
import { AuthContext } from 'auth'
type Props = {}

export default function Events({}: Props) {

  const [data, setdata] = React.useState<postdata[]>([])
  const [selectedschool, setselectedschool] = React.useState<string>('KNHS')
  const {currentUser} = useContext(AuthContext)
  const schools = ['KNHS', 'SCNHS']

  React.useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'post'), (snapshot) => {
      const result: postdata[] = [];
      snapshot.forEach((doc) => {
        const postData = doc.data();
        if (postData.active === true && postData.type === 'events' && postData.school === selectedschool) {
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
        }
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
  }, [selectedschool]);

  React.useEffect(() => {
    console.log('uy')
    const getUser = async() => {
      if(currentUser != null){
        const result: educationdata[] = await fetcheducation(currentUser?.uid) || [];
        const mapSchool: string = result[0].school
      
        setselectedschool(mapSchool)
        console.log('meron: ',mapSchool)
      } 
    }
    getUser()
  },[currentUser?.uid])

  const selectSchool = (item: string) => {
    setselectedschool(item)
  }
  return (
    <div className='container'>
        <img draggable = {false} src="https://i.imgur.com/mzylrqX.png" alt="Your Image"/>
      <div className="image-overlay">
        <div style = {{position: 'absolute', top: '13%'}}>
        <div className='school-select-container'>
          {!currentUser?.uid && schools.map((item, index) => 
            <a
              onClick={() => selectSchool(item)}
              className={selectedschool === item ? 'school-select' : 'unselected'}
              key={index}>{item} </a>
          )}
        </div>
          {data && data.map((item, index) => (<Data data = {item} />))}
        </div>
      </div>
    </div>
  )
}