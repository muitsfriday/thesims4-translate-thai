import React, { useState } from 'react'
import styled from 'styled-components'

const Row = styled.div`
  font-family: -apple-system, system-ui, BlinkMacSystemFont, 'Segoe UI', Roboto,
    'Tahoma';
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  padding: 10px;
  font-size: 12px;
  box-sizing: border-box;
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
  padding: 1px 10px;
  font-size: 12px;
  border: 1px solid #ccc;
  background: transparent;
  margin-left: 13px;
`

const SpreadBtn = styled(PlaceBtn)``

const TranslationInput = styled.textarea`
  padding: 5px 10px;
  border: 1px solid #e2e2e2;
  margin-top: 12px;
  width: 100%;
  box-sizing: border-box;
  height: 40px;
  font-size: 12px;
  border-radius: 5px;
`

const SkipBtn = styled.button`
  padding: 5px 10px;
  font-size: 12px;
  border: 1px solid #ccc;
  background: transparent;
  margin-top: 15px;
`

const UntranslatedRow = ({
  index,
  original,
  translation,
  onChange = () => {},
  onSpread = () => {}
}) => {
  const handleChange = e => {
    const val = e.target.value
    onChange(val)
  }
  const handleClickPlace = () => {
    onChange(original)
  }
  const handleClickSkip = () => {}
  const handleClickSpread = () => { console.log('clicked'); onSpread(original, translation) }

  return (
    <Row className={translation ? 'edited' : ''}>
      <Index>
        {index}
        <br /> <SkipBtn onClick={handleClickSkip}>--&gt;</SkipBtn>
      </Index>
      <Original>
        <OriginalText>
          {original} <PlaceBtn onClick={handleClickPlace}>{`=`}</PlaceBtn>
          <SpreadBtn onClick={handleClickSpread}>{`...=>`}</SpreadBtn>
        </OriginalText>
        <div>
          <TranslationInput
            rows="2"
            type="text"
            value={translation}
            onChange={handleChange}
          />
        </div>
      </Original>
    </Row>
  )
}

export default UntranslatedRow
