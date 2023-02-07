import React, {Component, Fragment, useRef} from 'react'
import {TimePicker as AntTimePicker} from 'antd'
import moment from 'moment'
import {useFormField, usePicker, makeField, makeLegacyField, makeRegisteredField, t} from '@eitje/form'
import utils from '@eitje/utils'

const TimePicker = (props) => {
  const {innerClass, pastDisabled, disabledTime, value, defaultOpenValue = '12:00', futureDisabled, onChange, readOnly, ...rest} = props
  const val = value ? moment(value, 'HH:mm') : value
  const defOpenValue = moment(defaultOpenValue, 'HH:mm')

  const condProps = {}
  if (readOnly) {
    condProps['open'] = false
    condProps['allowClear'] = false
  }

  if (disabledTime) {
    condProps['disabledTime'] = (now) => disabledTime(now, props)
  }

  return (
    <AntTimePicker
      {...condProps}
      showNow={false}
      format="HH:mm"
      placeholder="Select time.."
      className={`${innerClass} eitje-time-picker`}
      minuteStep={5}
      popupClassName="eitje-time-picker-panel"
      {...rest}
      value={val}
      defaultOpenValue={defOpenValue}
      onChange={(date) => onChange(date.format('HH:mm'))}
      onSelect={(date) => onChange(date.format('HH:mm'))}
    />
  )
}

export default TimePicker
