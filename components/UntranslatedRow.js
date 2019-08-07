import React, { useState } from 'react'
import styled from 'styled-components'

const Row = styled.div`
  font-family: -apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Tahoma";
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  height: 80px;
  padding: 10px;
`

const Index = styled.div`
  flex: 0 0 160px;
`

const Original = styled.div`
  flex: 1 0 300px;
`

const Transltated = styled.div`
  flex: 1 0 300px;
`

const OriginalText = styled.span`
  display: inline-block;
  padding-left: 10px;
`

const PlaceBtn = styled.button`
  padding: 5px 10px;
  font-size: 13px;
  border: 1px solid #ccc;
  background: transparent;
`

const TranslationInput = styled.textarea`
  padding: 10px;
  border: 1px solid #e2e2e2;
  margin-top: 12px;
  width: 100%;
  box-sizing: border-box;
  height: 70px;
  font-size: 14px;
  border-radius: 5px;
`

const SkipBtn = styled.button`
  padding: 5px 10px;
  font-size: 13px;
  border: 1px solid #ccc;
  background: transparent;
  margin-top: 15px;
`

const UntranslatedRow = ({ index, original, translation, onChange = () => {} }) => {
  const handleChange = e => {
    const val = e.target.value
    onChange(val)
  }
  const handleClickPlace = () => {
    onChange(original)
  }
  const handleClickSkip = () => {

  }

  return (
    <Row className={translation ? 'edited' : ''}>
      <Index>
        {index}
        <br /> <SkipBtn onClick={handleClickSkip}>--&gt;</SkipBtn>
      </Index>
      <Original>
        <OriginalText>
          {original} <PlaceBtn onClick={handleClickPlace}>+</PlaceBtn>
        </OriginalText>
        <div>
          <TranslationInput rows="2" type="text" value={translation} onChange={handleChange} />
        </div>
      </Original>
    </Row>
  )
}

export default UntranslatedRow
