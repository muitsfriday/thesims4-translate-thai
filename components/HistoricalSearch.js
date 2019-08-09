import React, { useState, Fragment } from 'react'
import styled from 'styled-components'

const Container = styled.div`
  font-size: 12px;
  font-family: -apple-system, system-ui, BlinkMacSystemFont, 'Segoe UI', Roboto,
    'Tahoma';
  padding: 5px;
  border-bottom: 1px solid #e0e0e0;
`

const ResultList = styled.ul`
  height: 300px;
  overflow: scroll; 
  margin: 0px;
  padding: 0px;
  padding-left: 10px;
`

const ResultItem = styled.li`
  margin: 0px;
  padding-bottom: 3px;
`

const SearchBar = styled.input`
  padding: 5px 10px;
  border: 1px solid #e2e2e2;
  margin-top: 2px;
  box-sizing: border-box;
  font-size: 12px;
  border-radius: 5px;
  width: 100%;
`

const Text = styled.p`
  margin: 5px;
`

export default ({ db }) => {
  const [term, setTerm] = useState('')
  const handleTermChange = e => setTerm(e.target.value)
  const results = term.trim().length
    ? db.filter(r => {
        return (
          r.$.Original &&
          r.$.Original.toLowerCase().includes(term.toLowerCase())
        )
      })
    : []

  return (
    <Container>
      <SearchBar placeholder="ค้นหาคำที่แปลแล้ว" value={term} onChange={handleTermChange} />
      <ResultList>
        {results.map(r => (
          <ResultItem>
            <Text>{r.$.Original}</Text>
            <Text>{r._}</Text>
          </ResultItem>
        ))}
      </ResultList>
    </Container>
  )
}
