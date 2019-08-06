import React, { Fragment, useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import fetch from 'isomorphic-unfetch'
import UntranslatedRow from '../../components/UntranslatedRow'
import TranslatedRow from '../../components/TranslatedRow'

const RecordComponent = ({ record, onChange }) => {
  const { $: attr, _: value } = record
  const isTranslated = typeof attr.Original === 'string'
  
  return isTranslated 
    ? <TranslatedRow index={ attr.Key } original={ attr.Original } translated={ value } /> 
    : <UntranslatedRow index={ attr.Key } original={ value } onChange={ onChange } />
}


const Translate = ({ data, initPage = 1 }) => {
  const total = data.length
  const limit = 20
  const totalPage = Math.ceil(total/limit)
  
  const router = useRouter()
  const { id } = router.query

  const [page, setPage] = useState(initPage)

  const [db, setDb] = useState(data)
  const changes = new Map()

  //const [records, setRecords] = useState([...db])

  const onTextUpdate = (text, index) => {
    changes.set(index, text)
  }

  const save = () => {
    changes.forEach((text, index) => {
      const record = db[index]
      db[index] = { $: { Key: record.$.Key, Original: record._ }, _: text }
    })
    setDb([...db])

    fetch(`http://localhost:3000/api/save?file=${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ list: db })
    })
  }  

  return (
    <>
     <button onClick={ save } >Save</button>
      <table>
        <thead>
          <tr>
            <th>Key</th>
            <th>Original</th>
            <th>Translated</th>
            <th>Manage</th>
          </tr>
        </thead>
        <tbody>
        { db.map((record, i) => <RecordComponent record={record} key={record.$.Key} onChange={text => onTextUpdate(text, i)} />) }
        </tbody>
      </table>
    </>
  )
}


Translate.getInitialProps = async (ctx) => {
  const data = await fetch(`http://localhost:3000/api/load?file=${ctx.query.id}`)
  const json = await data.json()
  return { data: json.list }
}


export default Translate