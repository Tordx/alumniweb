import { faChevronDown, faLock } from '@fortawesome/free-solid-svg-icons'
import { AuthContext } from 'auth'
import React from 'react'
import Card from 'screens/components/global/card'
import { LoginFields, Select } from 'screens/components/global/fields'
import Form from 'screens/contents/forms'
import { educationdata, logindata, statusdata } from 'types/interfaces'
import {updateDoc, doc} from '@firebase/firestore'
import { auth, db } from '../../../firebase/index'
import { User, updatePassword } from 'firebase/auth'
import { fetcheducation, fetchstatus } from '../../../firebase/function'
type Props = {}

export default function Education({}: Props) {
    const {currentUser} = React.useContext(AuthContext)
    const [form, setform] = React.useState<statusdata[]>([
      { 
        uid: '',
        status: [],
      }
    ])

    React.useEffect(() => {

      fetchdata()

    },[])

    const fetchdata = async() => {
      const result: statusdata[] = await fetchstatus(currentUser?.uid || '') || []
        setform([{ 
          uid: result[0].uid,
          status: result[0].status,
        }])
    }

    const updateeducation = async () => {

      const {uid, status} = form[0]
      
      if(!status){ 
          alert('Confirm your new password')
      } else {
        try {
          const educationRef = doc(db, 'user', currentUser?.uid || '');
            await updateDoc(educationRef, {
              uid: uid,
              status: status
            }).then(() => {
              alert('Educational Information succesfully updated')
              setform([
                { 
                  uid: uid,
                  status: status,
                }
            ])
        })
        } catch (error) {
        console.error('Error updating document:', error);
        }
      } 
    };

  return (
    <div className='container'>
        <img draggable = {false} src="https://i.imgur.com/mzylrqX.png" alt="Your Image"/>
      <div className="image-overlay">
        <Card className='form-wrapper'>
            <div className='form-container'>

            <h1>Educational Details</h1>
               
                {form[0].status && form[0].status.map((item, index) => (
                  <LoginFields
                    title = 'Alumni Status'
                    icon = {faLock}
                    disabled = {true}
                    onChange={() => {}}
                    placeholder= 'Enter Alumni Status' 
                    value= {item} 
                   />
                ))}
                <button>add details</button>
                {/* ADD A BUTTON HERE TO ADD A NEW  */}
                <button onClick = {updateeducation} style = {{marginTop: 20}}>
                      Update
                </button>
            </div>
        </Card>
      </div>
    </div>
  )
}