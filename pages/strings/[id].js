import React, { Fragment, useState, memo } from 'react'
import { useRouter } from 'next/router'
import fetch from 'isomorphic-unfetch'
import UntranslatedRow from '../../components/UntranslatedRow'
import TranslatedRow from '../../components/TranslatedRow'
import { FixedSizeList as List } from 'react-window'
import memoize from 'memoize-one'

const Row = memo(({ data, index, style }) => {
  const { db, changes } = data
  const { $: attr, _: value } = db[index]
  const { Key: key, Original: original, Translated: translated = '' } = attr
  const isTranslated = typeof original === 'string'
  const record = db[index]

  return (
    <div style={style}>
      {isTranslated ? (
        <TranslatedRow
          style={style}
          index={key}
          original={original}
          translated={value}
          onChange={text => changes.set(index, text)}
        />
      ) : (
        <UntranslatedRow
          style={style}
          index={key}
          original={value}
          translated={translated}
          onChange={text => changes.set(index, text)}
        />
      )}
    </div>
  )
})

const pack = memoize((db, changes) => ({ db, changes }))

const Translate = ({ data, initPage = 1 }) => {
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
      if (record.$.Original) {
        db[index] = { $: { Key: record.$.Key, Original: record.$.Original }, _: text }
      } else {
        db[index] = { $: { Key: record.$.Key, Original: record._ }, _: text }
      }
    })
    setDb([...db])

    fetch(`http://localhost:3000/api/save?file=${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ list: db })
    })

    changes.clear()
  }

  const total = db.length
  const translatedCount = db.filter(r => r.$.Original).length
  const percentage = translatedCount / total * 100
  const items = pack(db, changes)

  return (
    <>
      <div>Status translated: ({translatedCount}/{total}) {percentage}%</div>
      <button onClick={save}>Save</button>
      <List
        height={700}
        itemCount={db.length}
        itemData={items}
        itemSize={120}
        width={1200}
      >
        {Row}
      </List>
    </>
  )
}

Translate.getInitialProps = async ctx => {
  const data = await fetch(
    `http://localhost:3000/api/load?file=${ctx.query.id}`
  )
  const json = await data.json()
  return { data: json.list }
}

export default Translate
