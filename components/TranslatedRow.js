import React, { useState } from 'react'

const TranslatedRow = ({ index, original, translated, onChange = () => {} }) => {

  const [translation, setTranslation] = useState(translated)
  const handleChange = (e) => {
    onChange(e.target.value)
    setTranslation(e.target.value)
  }

  return (
    <tr>
      <td>{ index }</td>
      <td>{ original }</td>
      <td>{ translated }</td>
      <td>-</td>
    </tr>
  )
}

export default TranslatedRow