import { fetchdata } from '../../firebase/function'
import React from 'react'
import { postdata } from '../../types/interfaces'
import Data from 'screens/contents/data'

type Props = {}

export default function Events({}: Props) {

  const [data, setdata] = React.useState<postdata[]>([])

  React.useEffect(() => {
    const getdata = async() => {
      const result: postdata[] = await fetchdata('post') || [];
      const filterResult = result.filter((item) => item.type == 'events' && item.active === true)
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