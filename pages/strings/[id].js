import React, { Fragment, useState, memo } from 'react'
import { useRouter } from 'next/router'
import fetch from 'isomorphic-unfetch'
import UntranslatedRow from '../../components/UntranslatedRow'
import TranslatedRow from '../../components/TranslatedRow'
import { FixedSizeList as List, areEqual } from 'react-window'
import memoize from 'memoize-one'
import styled from 'styled-components'

const Wrapper = styled.div`
  width: 1200px;
  margin: auto;
`

const StatusBar = styled.div`
  font-family: -apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Tahoma";
  padding: 10px;
  border-bottom: 1px solid #e0e0e0;
  position: relative;
  height: 80px;
`

const SaveBtn = styled.button`
  padding: 5px 30px;
  font-size: 13px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: transparent;
  position: absolute;
  right: 10px;
  top: 5px;
`

const Checkbox = styled.input`
  margin: 0px;
  width: 15px;
  height: 15px;
  margin-right: 7px;
`

const FilterWrapper = styled.div`
  padding: 10px 0px;
`

const Row = memo(({ data, index, style }) => {
  const { db, changes } = data
  const { $: attr, _: value } = db[index]
  const { Key: key, Original: original, _index: recordIndex } = attr
  const isTranslated = typeof original === 'string'

  const callback = text => {
    changes.set(recordIndex, text)
  }

  return (
    <div style={{...style, backgroundColor: isTranslated ? '#99cef5' : 'transparent', overflow: 'hidden' }}>
      {isTranslated ? (
        <TranslatedRow
          index={`${key}-${recordIndex}`}
          original={original}
          translated={value}
          onChange={callback}
        />
      ) : (
        <UntranslatedRow
          index={`${key}-${recordIndex}`}
          original={value}
          translation={changes.get(recordIndex) || ''}
          onChange={callback}
        />
      )}
    </div>
  )
}, areEqual)


const postback = (id, db) => {
  fetch(`http://localhost:3000/api/save?file=${id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ list: db })
  })
}

const pack = memoize((db, changes, filter) => {
  if (filter) {
    return { db: db.filter(r => !r.$.Original), changes }
  }
  return { db, changes }
})


const hasWindow = typeof window !== 'undefined'

// Component
const Translate = ({ data, initPage = 1 }) => {
  const router = useRouter()
  const { id } = router.query

  data.map((data, i) => {
    data.$._index = i
  })

  const [db, setDb] = useState(data)
  const [viewPortHeight, setViewPortHeight] = useState(hasWindow ? (window.innerHeight - 80) : 800)
  const [onlyUntranslated, setOnlyUntranslated] = useState(false)
  const changes = new Map()

  if (hasWindow) {
    window.addEventListener('resize', () => { setViewPortHeight(window.innerHeight - 80) })
  }

  const save = () => {
    console.log('changes', changes.entries())
    changes.forEach((text, index) => {
      const record = db[index]
      if (record.$.Original) {
        db[index] = { $: { Key: record.$.Key, Original: record.$.Original }, _: text }
      } else {
        db[index] = { $: { Key: record.$.Key, Original: record._ }, _: text }
      }
    })
    changes.clear()
    setDb([...db])
    //postback(id, db)
  }

  const total = db.length
  const translatedCount = db.filter(r => r.$.Original).length
  const percentage = translatedCount / total * 100
  const items = pack(db, changes, onlyUntranslated)


  const handleFilterChange = e => {
    setOnlyUntranslated(e.target.checked)
  }

  console.log('rerender', items.db.length)
  return (
    <Wrapper>
      <StatusBar>
        <div>Status translated: ({translatedCount}/{total}) {percentage}%</div>
        <FilterWrapper>
          <Checkbox id="filter-untranslate" type="checkbox" checked={onlyUntranslated} onChange={handleFilterChange} /><label htmlFor="filter-untranslate" >Only untranslate</label>
        </FilterWrapper>
        <SaveBtn onClick={save}>Save</SaveBtn>
      </StatusBar>
      <List
        height={viewPortHeight}
        itemCount={items.db.length}
        itemData={items}
        itemSize={140}
        width={1200}
      >
        {Row}
      </List>
    </Wrapper>
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
