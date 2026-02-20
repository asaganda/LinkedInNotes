import { useEffect, useState } from 'react'
import fakeData from './placeholderdata.json'
import type { Connection } from './models/connection'
import Contact from './Contact'

const ConnectionList = () => {
    const [data, setData] = useState<Connection[]>([])

    useEffect(() => {
        const fetchData = async () => {
            setData(fakeData)
        }

        fetchData()
    })

    return (
        <div className="connection-list">
            <p>Connection List</p>
            <Contact data={data}/>
        </div>
    )
}

export default ConnectionList