import { faBuilding, faCalendarAlt, faCalendarCheck, faCalendarXmark, faChevronDown, faChevronRight, faLock, faMoneyBill, faSuitcase, faUserTag } from '@fortawesome/free-solid-svg-icons'
import { AuthContext } from 'auth'
import React, { useContext } from 'react'
import Card from 'screens/components/global/card'
import { LoginFields, Select } from 'screens/components/global/fields'
import Form from 'screens/contents/forms'
import { employmentdata, logindata } from 'types/interfaces'
import {updateDoc, doc} from '@firebase/firestore'
import { auth, db } from '../../../firebase/index'
import { User, updatePassword } from 'firebase/auth'
import { fetcheducation, fetchemployment, update } from '../../../firebase/function'
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
      console.log(result) 
      setform([{ 
          uid: result[0].uid,
          employee: result[0].employee,
          currentwork: result[0].currentwork,
          salary: result[0].salary,
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

      if(form[0].employee  === ''){ 
          alert('Please confirm employment status')
      } else {
        try {
          console.log(JSON.stringify({
            employee: form[0].employee,
              currentwork: form[0].currentwork,
              salary: form[0].salary,
              history: {
                uid: form[0].history.uid,
                work: form[0].history.work,
                yearstart:form[0]. history.yearstart,
                yearend: form[0].history.yearend,
                current:form[0]. history.current,
              },
          }))
          const personalRef = doc(db, 'user', currentUser?.uid || form[0].uid);
            await updateDoc(personalRef, {
              employee: form[0].employee,
              currentwork: form[0].currentwork,
              salary: form[0].salary,
              history: {
                uid: form[0].history.uid,
                work: form[0].history.work,
                yearstart:form[0]. history.yearstart,
                yearend: form[0].history.yearend,
                current:form[0]. history.current,
              },
            }).then((res: any) => {
              console.log(res)
            update(currentUser?.uid || form[0].uid)
            fetchdata()
              alert('Employment Information succesfully updated')
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

            <h1>Employment Details</h1>
            <Select
                  selection={['Employed', 'Self-Employed', 'Retired', 'Unemployed']}
                  title = 'Employment Status'
                  icon = {faChevronRight}
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
                    title='Current/Previous Work'
                    icon = {faSuitcase}
                    disabled = {false}
                    onChange={(e) => setform((prev) => [
                        {
                          ...prev[0],
                          currentwork: e.target.value,
                        },
                      ])}
                    placeholder= 'Enter Current or Previous work' 
                    value= {form[0].currentwork} 
                />
                <LoginFields
                    title = 'Salary/Income Range'
                    icon = {faMoneyBill}
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
                  title='Company Name*'
                  icon={faBuilding}
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
                      type = 'number'
                      icon={faCalendarCheck}
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
                      placeholder='Enter Year Started'
                      value={form[0].history.yearstart}
                    />
                    {form[0].employee === 'Unemployed' || form[0].employee === 'Retired' && 
                      <LoginFields
                        title='Year End*'
                        icon={faCalendarXmark}
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
                      />
                    }
                   { form[0].employee !== 'Unmployed'  &&
                    <Select
                      selection={['Yes', 'No']}
                      title='Is this your current/last job?'
                      icon={faChevronRight}
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