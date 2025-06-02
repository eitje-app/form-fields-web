import React, {Component, Fragment, useRef} from 'react'
import {DatePicker as AntDatePicker} from 'antd'
import moment from 'moment'
import {useFormField, usePicker, makeField, makeLegacyField, makeRegisteredField, t} from '@eitje/form'
import utils from '@eitje/utils'

const defaultFormat = ['DD-MM-YYYY', 'YYYY-MM-DD']

const disabledAfterToday = date => date && date.endOf('day') <= moment().endOf('day')
const disabledBeforeToday = date => date && date.endOf('day') >= moment().endOf('day')

const disabledTodayAndBefore = date => date && date.endOf('day') > moment().endOf('day')
const disabledTodayAndAfter = date => date && date.endOf('day') < moment().endOf('day')

const isDateDisabled = (
  date,
  {
    disabledAfter,
    disabledBefore,
    disabledRanges,
    disabledFn,
    formData,
    field,
    isEnd = field == 'end_date',
    isStart = field == 'start_date',
    startDateField = 'start_date',
    endDateField = 'end_date',
    futureDisabled,
    pastDisabled,
    pastDisabledToday,
    futureDisabledToday,
  },
) => {
  let valid = true

  if (disabledFn) {
    return disabledFn(date)
  }

  let _disabledAfter = utils.funcOrObj(disabledAfter, formData)
  let _disabledBefore = utils.funcOrObj(disabledBefore, formData)

  if (futureDisabled) valid = disabledAfterToday(date)

  if (futureDisabledToday && valid) valid = disabledTodayAndAfter(date)

  if (isStart && valid && formData[endDateField]) {
    valid = date <= moment(formData[endDateField], defaultFormat).startOf('day')
  }

  if (isEnd && valid && formData[startDateField]) {
    valid = date >= moment(formData[startDateField], defaultFormat).startOf('day')
  }

  if (pastDisabled && valid) valid = disabledBeforeToday(date)

  if (pastDisabledToday && valid) valid = disabledTodayAndBefore(date)

  if (_disabledAfter && valid) {
    valid = date < moment(_disabledAfter, defaultFormat).startOf('day')
  }

  if (_disabledBefore && valid) {
    valid = date > moment(_disabledBefore, defaultFormat).endOf('day')
  }

  if (disabledRanges && valid && date) {
    valid = !disabledRanges.some(r => r.contains(date))
  }

  return !valid
}

const DatePicker = props => {
  const picker = useRef(null)
  const {
    innerClass,
    pastDisabled,
    disabledBefore,
    disabledAfter,
    customFormat,
    disabledDate,
    futureDisabled,
    onChange,
    value,
    readOnly,
    renderExtraFooter,
    formData,
    defaultPickerValue,
    ...rest
  } = props

  const _defaultFormat = customFormat || defaultFormat
  const val = value ? moment(value, _defaultFormat) : null

  const condProps = {}
  let extraFooter
  if (readOnly) {
    condProps['open'] = false
    condProps['allowClear'] = false
  }

  const _defPickerValue = utils.funcOrObj(value || defaultPickerValue, formData)
  const defPickerValue = _defPickerValue && moment(_defPickerValue, _defaultFormat)

  if (_.isFunction(renderExtraFooter)) {
    condProps['renderExtraFooter'] = () => renderExtraFooter({value: val, onChange, startValue: formData?.['start_date'], picker})
    condProps['dropdownClassName'] = 'has-extra-footer'
  }

  return (
    <Fragment>
      <AntDatePicker
        ref={picker}
        {...condProps}
        className={`${innerClass} eitje-date-picker`}
        disabledDate={date => isDateDisabled(date, props)}
        format={_defaultFormat}
        {...rest}
        value={val}
        onChange={(date, dateString) => onChange(dateString)}
        defaultPickerValue={defPickerValue}
      />
    </Fragment>
  )
}

export default DatePicker
