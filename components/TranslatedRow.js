import React, { useState } from 'react'
import styled from 'styled-components'

const Row = styled.div`
  font-family: -apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Tahoma";
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  padding: 10px;
  font-size: 12px;
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

const TranslatedContainer = styled.div`
  padding: 10px;
`

const EditBtn = styled.button`
  display: inline-block;
  padding: 5px 10px;
  font-size: 13px;
  border: 1px solid #39607b;
  background: transparent;
  margin-top: 15px;
`

const TranslationInput = styled.input`
  padding: 10px;
  border: 1px solid #e2e2e2;
  margin-top: 12px;
  width: 100%;
  box-sizing: border-box;
  font-size: 14px;
  border-radius: 5px;
`

const TranslatedText = styled.span`
  display: inline-block;
  margin-right: 30px;
`

const TranslatedRow = ({
  index,
  original,
  translated,
  onChange = () => {}
}) => {


  const [translation, setTranslation] = useState(translated)
  const [editMode, setEditMode] = useState(false) 
  const handleEditClick = () => {
    setEditMode(true)
  }
  const handleTranslationChange = e => {
    const val = e.target.value
    onChange(val)
    setTranslation(val)
  }

  return (
    <Row>
      <Index>{index} <br /><EditBtn onClick={handleEditClick} >แก้ไข</EditBtn></Index>
      <Original>
        <OriginalText>
          {original}
        </OriginalText>
        <TranslatedContainer>
          {
            editMode 
              ? <TranslationInput type="text" value={translation} onChange={handleTranslationChange} />
              : <><TranslatedText>{translated}</TranslatedText></>
          }
        </TranslatedContainer>
      </Original>
    </Row>
  )
}

export default TranslatedRow
