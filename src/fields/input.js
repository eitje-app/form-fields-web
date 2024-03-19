import React, {Component, Fragment, useRef} from 'react'
import {Input as AntInput} from 'antd'
import moment from 'moment'
import {useFormField, usePicker, makeField, makeLegacyField, makeRegisteredField, t} from '@eitje/form'
import utils from '@eitje/utils'

const change = (props, val, event) => {
  const {formatValue, onChange} = props
  let newVal = val
  if (formatValue) {
    newVal = formatValue(val)
    if (_.isNaN(newVal)) return
  }

  onChange(newVal, event)
}

const Input = (props) => {
  const {
    value,
    secure,
    textarea,
    suffix,
    charCounterProps = {},
    innerRef,
    newForm,
    hideCharCounter,
    maxLength,
    autocomplete = 'nope',
    autoSize = {minRows: 2, maxRows: 12},
    disableAutoComplete,
    readOnly,
    ...rest
  } = props
  const InputEl = textarea ? AntInput.TextArea : secure ? AntInput.Password : AntInput
  const _suffix = utils.funcOrVal(suffix, props)

  const handleFocus = (e) => {
    if (disableAutoComplete) {
      e.target.removeAttribute('readonly')
    }
    props.onFocus?.(e)
  }
  return (
    <Fragment>
      <InputEl
        autocomplete={autocomplete}
        className="eitje-input"
        ref={innerRef}
        maxLength={maxLength}
        {...rest}
        suffix={_suffix}
        value={value}
        autoSize={autoSize}
        onChange={(e) => change(props, e.target.value, e)}
        onFocus={handleFocus}
        readOnly={disableAutoComplete || readOnly}
      />
      {!newForm && !!maxLength && !hideCharCounter && <CharCounter value={value} maxLength={maxLength} {...charCounterProps} />}
    </Fragment>
  )
}

const makeCharClass = (charsLeft, {warningThreshold = 10, dangerThreshold = 5}) => {
  if (charsLeft < dangerThreshold) return 'char-counter-danger'
  if (charsLeft < warningThreshold) return 'char-counter-warning'
  return ''
}

const CharCounter = ({maxLength, value = '', ...rest}) => {
  const charsLeft = maxLength - (value?.length || 0)
  const className = makeCharClass(charsLeft, rest)
  return <p className={`char-counter ${className}`}>{charsLeft}</p>
}

export default Input
