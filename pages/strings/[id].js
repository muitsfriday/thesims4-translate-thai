import React, { Fragment, useState, memo } from 'react'
import { useRouter } from 'next/router'
import fetch from 'isomorphic-unfetch'
import Row from '../../components/Row'
import HistoricalSearch from '../../components/HistoricalSearch'
import { FixedSizeList as List } from 'react-window'
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
  padding: 5px 10px;
  border-bottom: 1px solid #e0e0e0;
  position: relative;
  height: 80px;
  font-size: 12px;
`

const SaveBtn = styled.button`
  padding: 5px 20px;
  font-size: 12px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: transparent;
  position: absolute;
  right: 10px;
  top: 5px;
`

const ApplyBtn = styled.button`
  padding: 5px 30px;
  font-size: 12px;
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
  padding: 5px 0px;
`

const TextSearch = styled.input`
  padding: 3px 10px;
  border: 1px solid #e2e2e2;
  margin-top: 2px;
  box-sizing: border-box;
  font-size: 12px;
  border-radius: 5px;
  margin-left: 10px;
`

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`

const CustomList = styled(List)`
  flex: 0 0 900px;
  box-sizing: border-box;
  padding-right: 10px;
  border-right: 1px solid #e0e0e0;
`

const SideContainer = styled.div`
  flex: 0 0 300px;
`

const StatusText = styled.span`
  font-size: 10px;
  color: #93760d;
  display: inline-block;
  margin-left: 20px;
`

// -------- end css ------------ //

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

const pack = memoize((db, changes, setChanges, handleSpread) => {
  return { db, changes, setChanges, onSpread: handleSpread }
})

const applyFilter = (filter, data) => {
  return data.filter(r => {
    const o = (r.$.Original || r._).toLowerCase()
    return (
      (filter.onlyUntranslate ? !r.$.Original : true) &&
      (filter.text.length ? o.includes(filter.text) : true)
    )
  })
}

// Component
const Translate = ({ data }) => {
  const router = useRouter()
  const { id } = router.query

  const [statusText, setStatusText] = useState('console')
  const [database, setDatabase] = useState(data)
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
    new Map(Object.entries(changes)).forEach(({ text, index }, recordIndex) => {
      const record = database[recordIndex]
      if (record.$.Original) {
        database[recordIndex] = {
          $: {
            Key: record.$.Key,
            Original: record.$.Original,
            _index: recordIndex
          },
          _: text
        }
      } else {
        database[recordIndex] = {
          $: { Key: record.$.Key, Original: record._, _index: recordIndex },
          _: text
        }
      }
      displayData[index] = { ...database[recordIndex] }
    })
    setStatusText(`saved ${Object.keys(changes).length} records.`)
    setChanges({})
    setDatabase([...database])
    setDisplayData([...displayData])
    postback(id, database)
  }

  const total = database.length
  const translatedCount = database.filter(r => r.$.Original).length
  const percentage = ((translatedCount / total) * 100).toFixed(4)
  const translatedWords = database.filter(r => r.$.Original)

  const handleFilterChange = e => {
    const nextFilter = {
      ...filter,
      onlyUntranslate: e.target.checked
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

  const handleSpread = (original, translated) => {
    const matched = database.filter(r => (r.$.Original || r._) === original)
    setStatusText(`speard operation matched ${matched.length} records`)
    matched.forEach(r => {
      changes[r.$._index] = { text: translated }
    })
    displayData.forEach((v, i) => {
      if (v._ === original) {
        changes[v.$._index] = { text: translated, index: i }
      }
    })
    setChanges({ ...changes })
  }

  const items = pack(displayData, changes, setChanges, handleSpread)

  return (
    <Wrapper>
      <StatusBar>
        <div>
          Translated: ({translatedCount}/{total}) {percentage}%
          <StatusText>{statusText}</StatusText>
        </div>
        <FilterWrapper>
          <Checkbox
            id="filter-untranslate"
            type="checkbox"
            checked={filter.onlyUntranslate}
            onChange={handleFilterChange}
          />
          <label htmlFor="filter-untranslate">เฉพาะที่ยังไม่ได้แปล</label>
          <TextSearch
            type="text"
            onChange={handleTextFilterChange}
            placeholder="กรองคำที่มี..."
          />
        </FilterWrapper>
        <SaveBtn onClick={save}>Save({Object.keys(changes).length})</SaveBtn>
      </StatusBar>
      <ContentWrapper>
        <CustomList
          height={viewPortHeight}
          itemCount={items.db.length}
          itemData={items}
          itemSize={120}
          width={900}
        >
          {Row}
        </CustomList>
        <SideContainer>
          <HistoricalSearch db={translatedWords} />
        </SideContainer>
      </ContentWrapper>
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
      if (!record._) {
        record._ = ''
      }
      return record
    })
  }
}

export default Translate
