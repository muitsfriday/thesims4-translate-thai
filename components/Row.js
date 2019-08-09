import React, { memo } from 'react'
import { areEqual } from 'react-window'

import TranslatedRow from './TranslatedRow'
import UntranslatedRow from './UntranslatedRow'


const Row = memo(({ data, index, style }) => {
  const { db, changes, setChanges, onSpread = () => {} } = data
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
          onSpread={onSpread}
        />
      )}
    </div>
  )
}, areEqual)

export default Row