import React, { Fragment, useState, memo } from 'react'
import { useRouter } from 'next/router'
import fetch from 'isomorphic-unfetch'
import UntranslatedRow from '../../components/UntranslatedRow'
import TranslatedRow from '../../components/TranslatedRow'
import { FixedSizeList as List, areEqual } from 'react-window'
import memoize from 'memoize-one'
import styled from 'styled-components'

const hasWindow = typeof window !== 'undefined'

const Wrapper = styled.div`
  width: 1200px;
  margin: auto;
`

const StatusBar = styled.div`
  font-family: -apple-system, system-ui, BlinkMacSystemFont, 'Segoe UI', Roboto,
    'Tahoma';
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

const ApplyBtn = styled.button`
  padding: 5px 30px;
  font-size: 13px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: transparent;
  top: 5px;
  margin-left: 5px;
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

const TextSearch = styled.input`
  padding: 5px 10px;
  border: 1px solid #e2e2e2;
  margin-top: 2px;
  box-sizing: border-box;
  font-size: 12px;
  border-radius: 5px;
  margin-left: 10px;
`

const Row = memo(({ data, index, style }) => {
  const { db, changes, setChanges } = data
  const { $: attr, _: value } = db[index]
  const { Key: key, Original: original, _index: recordIndex } = attr
  const isTranslated = typeof original === 'string'

  const callback = text => {
    changes[recordIndex] = { text, index }
    setChanges({ ...changes })
  }

  const change = changes[recordIndex] || { text: '', index }

  return (
    <div
      style={{
        ...style,
        backgroundColor: isTranslated ? '#99cef5' : 'transparent',
        overflow: 'hidden'
      }}
    >
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
          translation={change.text}
          onChange={callback}
        />
      )}
    </div>
  )
}, areEqual)

const postback = (id, db) => {
  const data = db.map(r => {
    return r
  })
  fetch(`http://localhost:3000/api/save?file=${id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ list: db })
  })
}

const pack = memoize((db, changes, setChanges) => {
  return { db, changes, setChanges }
})

const applyFilter = (filter, data) => {
  return data.filter(r => {
    const o = (r.$.Original || r._).toLowerCase()
    return (filter.onlyUntranslate ? !r.$.Original : true) 
    && (filter.text.length ? o.includes(filter.text) : true) 
  })
}

// Component
const Translate = ({ data }) => {
  const router = useRouter()
  const { id } = router.query

  const [database, setDatabase] = useState(data)
  const [replacer, setReplacer] = useState({
    find: '',
    replace: '',
    matched: 0
  })
  const [changes, setChanges] = useState({})
  const [viewPortHeight, setViewPortHeight] = useState(
    hasWindow ? window.innerHeight - 80 : 800
  )
  const [filter, setFilter] = useState({
    onlyUntranslate: false,
    text: ''
  })
  const [displayData, setDisplayData] = useState(database)

  if (hasWindow) {
    window.addEventListener('resize', () => {
      setViewPortHeight(window.innerHeight - 80)
    })
  }

  const save = () => {
    console.log(changes)
    new Map(Object.entries(changes)).forEach(({ text, index }, recordIndex) => {
      const record = database[recordIndex]
      if (record.$.Original) {
        database[recordIndex] = {
          $: { Key: record.$.Key, Original: record.$.Original, _index: recordIndex },
          _: text
        }
      } else {
        database[recordIndex] = {
          $: { Key: record.$.Key, Original: record._, _index: recordIndex },
          _: text
        }
      }
      displayData[index] = { ...database[recordIndex],  }
    })
    setChanges({})
    setDatabase([...database])
    setDisplayData([...displayData])
    postback(id, database)
  }

  const matchAll = () => {
    const match = database.filter(r => !r.$.Original && r._ === replacer.find)
    setReplacer({
      ...replacer,
      matched: match.length
    })
  }

  const translateAll = () => {
    const match = database.filter(r => !r.$.Original && r._ === replacer.find)
    match.forEach(r => {
      changes[r.$._index] = { text: replacer.replace }
    })
    const display = applyFilter(filter, database)
    display.forEach((v, i) => {
      if (v._ === replacer.find) {
        changes[v.$._index] = { text: replacer.replace, index: i }
      }
    })
    setDisplayData(display)
    setChanges({ ...changes })
    setReplacer({
      find: '',
      replace: '',
      matched: 0
    })
  }

  const total = database.length
  const translatedCount = database.filter(r => r.$.Original).length
  const percentage = (translatedCount / total) * 100

  const handleFilterChange = e => {
    const nextFilter = {
      ...filter,
      onlyUntranslate: e.target.checked,
    }
    setFilter(nextFilter)
    setDisplayData(applyFilter(nextFilter, database))
  }

  const handleTextFilterChange = e => {
    const val = e.target.value.toLowerCase()
    const nextFilter = {
      ...filter,
      text: val
    }
    setFilter(nextFilter)
    setDisplayData(applyFilter(nextFilter, database))
  }

  const handleFindTextChange = e => {
    const val = e.target.value
    const nextReplacer = {
      ...replacer,
      find: val
    }
    setReplacer(nextReplacer)
  }

  const handleReplaceTextChange = e => {
    const val = e.target.value
    const nextReplacer = {
      ...replacer,
      replace: val
    }
    setReplacer(nextReplacer)
  }

  const items = pack(displayData, changes, setChanges)

  return (
    <Wrapper>
      <StatusBar>
        <div>
          Status translated: ({translatedCount}/{total}) {percentage}%
          <TextSearch type="text" placeholder="translate all" onChange={handleFindTextChange} value={replacer.find} />
          <ApplyBtn onClick={matchAll}>Match All</ApplyBtn>
          {
            replacer.matched ? (
              <>
              <TextSearch type="text" placeholder="with" onChange={handleReplaceTextChange} value={replacer.replace} />
              <ApplyBtn onClick={translateAll}>Translated All ({replacer.matched})</ApplyBtn>
              </>
            ) : null
          }
        </div>
        <FilterWrapper>
          <Checkbox
            id="filter-untranslate"
            type="checkbox"
            checked={filter.onlyUntranslate}
            onChange={handleFilterChange}
          />
          <label htmlFor="filter-untranslate">Only untranslate</label>
          <TextSearch type="text" onChange={handleTextFilterChange} />
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

  return {
    data: json.list.map((record, i) => {
      record.$._index = i
      if (!record._) { record._ = '' }
      return record
    })
  }
}

export default Translate
