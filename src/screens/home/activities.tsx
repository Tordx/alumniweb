import { fetchdata } from '../../firebase/function'
import React, { useEffect } from 'react'
import Card from 'screens/components/global/card'
import Data from 'screens/contents/data'
import { postdata } from 'types/interfaces'
import {onSnapshot,collection, setDoc, doc} from '@firebase/firestore'
import { db } from '../../firebase/index'
type Props = {}

export default function Activities({}: Props) {

  const [data, setdata] = React.useState<postdata[]>([])
  const [selectedschool, setselectedschool] = React.useState('KNHS')
  const schools = ['KNHS', 'SCNHS']
  React.useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'post'), (snapshot) => {
      const result: postdata[] = [];
      snapshot.forEach((doc) => {
        const postData = doc.data();
        if (postData.active === true && postData.type === 'activities' && postData.school === selectedschool) {
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
      setdata(result);
    });

    return () => unsubscribe();
  }, [selectedschool]);

  const selectSchool = (item: string) => {
    setselectedschool(item)
  }


  return (
    <div className='container'>
        <img draggable = {false} src="https://i.imgur.com/mzylrqX.png" alt="Your Image"/>
      <div className="image-overlay">
        <div style = {{position: 'absolute', top: '13%'}}>
        <div className='school-select-container'>
          {schools && schools.map((item, index) => 
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