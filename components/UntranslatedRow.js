import React, { useState } from 'react'

const UntranslatedRow = ({ index, original, onChange = () => {} }) => {

  const [translation, setTranslation] = useState('')
  const handleChange = (e) => {
    onChange(e.target.value)
    setTranslation(e.target.value)
  }

  return (
    <tr className={ translation ? 'edited' : '' }>
      <td>{ index }</td>
      <td>{ original }</td>
      <td><input type="text" value={ translation } onChange={handleChange} /></td>
      <td>-</td>
    </tr>
  )
}

export default UntranslatedRow