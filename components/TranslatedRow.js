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
  flex: 0 0 100px;
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
  padding: 5px 10px;
  font-size: 13px;
  border: 1px solid #ccc;
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
      <Index>{index}</Index>
      <Original>
        <OriginalText>
          {original}
        </OriginalText>
        <TranslatedContainer>
          {
            editMode 
              ? <input type="text" value={translation} onChange={handleTranslationChange} />
              : <>{translated} <EditBtn onClick={handleEditClick} >แก้ไข</EditBtn></>
          }
        </TranslatedContainer>
      </Original>
    </Row>
  )
}

export default TranslatedRow
