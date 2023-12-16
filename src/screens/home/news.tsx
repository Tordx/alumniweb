import { fetchdata } from '../../firebase/function'
import React from 'react'
import { Header } from 'screens/components/gen/header'
import Navbarmenu from 'screens/components/gen/navigator/navbarmenu'
import { postdata } from '../../types/interfaces'
import Data from 'screens/contents/data'

type Props = {}

export default function News({}: Props) {
  const [data, setdata] = React.useState<postdata[]>([])

  React.useEffect(() => {
    const getdata = async() => {
      const result: postdata[] = await fetchdata('post') || [];
      const filterResult = result.filter((item) => item.type == 'news' && item.active === true)
      setdata(filterResult)
    }
    getdata()
  },[])
  return (
    <div className='container'>
        <img draggable = {false} src="https://i.imgur.com/mzylrqX.png" alt="Your Image"/>
      <div className="image-overlay">
        <div style = {{position: 'absolute', top: '13%'}}>
          {data && data.map((item, index) => (<Data data = {item} />))}
        </div>
      </div>
    </div>
  )
}