import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect } from 'react'
import Card from 'screens/components/global/card'
import {getDocs,collection, setDoc, doc} from '@firebase/firestore'
import { db } from '../../firebase/index'

type Props = {


}

interface schooldata {
    school: string,
    email: string,
    address: string,
    contactnumber: string,
}

interface contactdata {
    schooldetails: schooldata[]
}
export default function Emailer({}: Props) {

    // const [contact, setcontact] = React.useState<schooldata>()

    //  const fetchcontacts = async() => {
    //     try {
    //       const querySnapshot = await getDocs(collection(db, 'contacts'));
    //       const thisdata: contactdata[] = []
    //       querySnapshot.forEach((doc) => {
    //         thisdata.push({
    //             schooldetails: doc.data().schooldetails
    //         })
    //       })
      
    //       return thisdata;
      
    //     } catch(error){
    //       console.log(error)
    //     }
    //   }

  return (
    <div className='container'>
    <img draggable = {false} src="https://i.imgur.com/mzylrqX.png" alt="Your Image"/>
     <div className="image-overlay">
        <Card className='form-wrapper contacts-container'>
                <h1>CONTACT US</h1>
                <h4>If you have further questions/concerns or need assistance, reach us out</h4>
                <div className='contacts'>
                    <h4>Schools</h4>
                    <p>Kalamansig National HIghschool</p>
                    <h5>Notre Dame Avenue, Poblacion, Kalamansig, Sultan Kudarat</h5>
                    <p>Sta. Clara National HIghschool</p>
                    <h5>Sta. Clara, Kalamansig, Sultan Kudarat</h5>
                    <h4>Email</h4>
                    <a href='mailto:kalamansignhs@edu.gov.ph'>kalamansignhs@edu.gov.ph</a>
                    <a href='mailto:sta.claranhs@edu.gov.ph'>sta.claranhs@edu.gov.ph</a>
                    <h4>Contact details</h4>
                    <p>+639123123123(admin)</p>
                    <p>+639232342342(staff)</p>
                    <br/>
                    <h5>To report bugs and web support:</h5>
                    <a href='admin@alumni-tracking.online'>admin@alumni-tracking.online</a>
                    <h5>Visit us on: </h5>
                    </div>
        </Card>
        </div>
    </div>
  )
}