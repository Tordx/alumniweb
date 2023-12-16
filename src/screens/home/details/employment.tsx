import { faChevronDown, faLock, faUserTag } from '@fortawesome/free-solid-svg-icons'
import { AuthContext } from 'auth'
import React, { useContext } from 'react'
import Card from 'screens/components/global/card'
import { LoginFields, Select } from 'screens/components/global/fields'
import Form from 'screens/contents/forms'
import { employmentdata, logindata } from 'types/interfaces'
import {updateDoc, doc} from '@firebase/firestore'
import { auth, db } from '../../../firebase/index'
import { User, updatePassword } from 'firebase/auth'
import { fetcheducation, fetchemployment } from '../../../firebase/function'
type Props = {}

export default function Employment({}: Props) {
    const {currentUser} = useContext(AuthContext)
    const [form, setform] = React.useState<employmentdata[]>([
      { 
        uid: '',
        employee: '',
        currentwork: '',
        salary: '',
        history: {
          uid: '',
          work: '',
          yearstart: '',
          yearend: '',
          current: false,
        },
      }
    ])

    React.useEffect(() => {

      fetchdata()

    },[])

    const fetchdata = async() => {
      const result: employmentdata[] = await fetchemployment(currentUser?.uid || '') || []
        setform([{ 
          uid: result[0].uid || '',
          employee: result[0].employee || '',
          currentwork: result[0].currentwork || '',
          salary: result[0].salary || '',
          history: {
            uid: result[0].history.uid || '',
            work: result[0].history.work || '',
            yearstart: result[0].history.yearstart || '',
            yearend: result[0].history.yearend || '',
            current: result[0].history.current || false,

          }
        }])
    }

    const updateEmployment = async () => {

      const {uid,employee, currentwork, salary, history} = form[0]
      
      if(employee){ 
          alert('Please confirm employment status')
      } else {
        try {

          const personalRef = doc(db, 'user', currentUser?.uid || '');
            await updateDoc(personalRef, {
              uid: uid,
              employee: employee,
              currentwork: currentwork,
              salary: salary,
              history: {
                uid: history.uid,
                work: history.work,
                yearstart: history.yearstart,
                yearend: history.yearend,
                current: history.current,
              },
            }).then(() => {
              alert('Personal Information succesfully updated')
              setform([
                { 
                  uid: form[0].uid,
                  employee: form[0].employee,
                  currentwork: form[0].currentwork,
                  salary: form[0].salary,
                  history: {
                    uid: form[0].history.uid,
                    work: form[0].history.work,
                    yearstart: form[0].history.yearstart,
                    yearend: form[0].history.yearend,
                    current: form[0].history.current,
                  }
                }
             ])
            fetchdata()
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

            <h1>Account Details</h1>
            <Select
                  selection={['Employed', 'Self-Employed', 'Retired', 'Unemployed']}
                  title = 'Employment Status'
                  icon = {faChevronDown}
                  onChange={(e) => {
                    setform((prev) => [
                    {
                      ...prev[0],
                      employee: e.target.value,
                    },
                    ])}
                  }
                  placeholder= 'Emplpoyment Status' 
                  value= {form[0].employee} 
            />
                <LoginFields
                    title='Current Work'
                    icon = {faUserTag}
                    disabled = {false}
                    onChange={(e) => setform((prev) => [
                        {
                          ...prev[0],
                          currentwork: e.target.value,
                        },
                      ])}
                    placeholder= 'Current Work' 
                    value= {form[0].currentwork} 
                />
                <LoginFields
                    title = 'Salary/Income Range'
                    icon = {faLock}
                    disabled = {false}
                    onChange={(e) => setform((prev) => [
                        {
                          ...prev[0],
                          salary: e.target.value,
                        },
                    ])}
                    placeholder= 'Enter Salary/Income Range' 
                    value= {form[0].salary} 
                />
                <LoginFields
                  title='Work Name*'
                  icon={faLock}
                  disabled={false}
                  onChange={(e) => setform((prev) => [
                    {
                      ...prev[0],
                      history: {
                        ...prev[0].history,
                        work: e.target.value,
                      },
                    },
                  ])}
                  placeholder='Work Name'
                  value={form[0].history.work}
                />
                    <LoginFields
                      title='Year Start*'
                      icon={faLock}
                      disabled={false}
                      onChange={(e) => setform((prev) => [
                        {
                          ...prev[0],
                          history: {
                            ...prev[0].history,
                            yearstart: e.target.value,
                          },
                        },
                      ])}
                      placeholder='Salary/Income Range'
                      value={form[0].history.yearstart}
                    />
                    {form[0].employee === 'Unemployed' && <LoginFields
                      title='Year End*'
                      icon={faLock}
                      disabled={false}
                      onChange={(e) => setform((prev) => [
                        {
                          ...prev[0],
                          history: {
                            ...prev[0].history,
                            yearend: e.target.value,
                          },
                        },
                      ])}
                      placeholder='Enter the year ended*'
                      value={form[0].history.yearend}
                    />}
                   {form[0].employee !== 'Unemployed' &&
                   <Select
                   selection={['Yes', 'No']}
                   title='Is this your current job?'
                   icon={faChevronDown}
                   onChange={(e) => {
                    const selectedcurrent = e.target.value === 'Yes' ? true : false
                    setform((prev) => [
                      {
                        ...prev[0],
                        history: {
                          ...prev[0].history,
                          current: selectedcurrent,
                        },
                      },
                  ])}}
                   placeholder='Current Job?'
                   value={form[0].history.current ? 'Yes' : 'No'}
                      />
                    }
                <button onClick = {updateEmployment} style = {{marginTop: 20}}>
                      Update
                </button>
            </div>
        </Card>
      </div>
    </div>
  )
}