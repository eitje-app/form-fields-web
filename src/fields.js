import React from 'react'
import {Switch as AntSwitch, Checkbox as AntCheckbox} from 'antd'
import RawDropdownPicker from './fields/dropdown'
import RawTimePicker from './fields/time_picker'
import RawDatePicker from './fields/date_picker'
import BaseInput from './fields/input'
import {makeField, makeNewField, useFormSelector, makeNewRegisteredField, makeLegacyField, makeRegisteredField} from '@eitje/form'
import utils from '@eitje/utils'

const _buildField = components => props => {
  const {Full, Form, Base, NewWithoutDecoration, New} = components
  const {form = true, decorated = true, raw} = props
  const isNew = useFormSelector('newForm')
  if (isNew) {
    if (decorated) return <New {...props} newForm />
    return <NewWithoutDecoration {...props} newForm />
  }
  if (raw) return <Base {...props} />
  if (form && decorated) return <Full {...props} />
  if (form) return <Form {...props} />
  return <Base {...props} />
}

const buildField = (Base, opts = {}) => {
  return _buildField({
    Full: makeField(Base, opts),
    Form: makeRegisteredField(Base),
    New: makeNewField(Base, opts),
    NewWithoutDecoration: makeNewRegisteredField(Base),
    Base,
  })
}

const RawSwitch = props => {
  const {value} = props
  return <AntSwitch className="eitje-switch" {...props} checked={!!value} />
}

const RawCheckbox = props => {
  const {value, innerRef, onChange = _.noop} = props
  return <AntCheckbox ref={innerRef} className="eitje-checkbox" {...props} onChange={e => onChange(e.target.checked)} checked={!!value} />
}

const _withIcon = props => !props.selectAll

const defaultDropdownValue = props => {
  if (props.multiple) return []
  return null
}

const getDropdownPickerClassName = props => {
  return utils.makeCns('eitje-dropdown-container', props.multiple && 'eitje-dropdown-container-multiple')
}

const DropdownPicker = buildField(RawDropdownPicker, {
  className: getDropdownPickerClassName,
  withClearIcon: _withIcon,
  withIcon: _withIcon,
  defaultPickerValue: defaultDropdownValue,
})

const LegacyDropdownPicker = makeLegacyField(RawDropdownPicker, {
  className: 'eitje-dropdown-container',
})

const getInputProps = props => {
  const className = utils.makeCns(
    'eitje-input-container',
    props.textarea && 'eitje-input-container-textarea',
    props.password && 'eitje-input-container-password',
  )

  return {className, icon: false, withClearIcon: true, clearIcon: true}
}

let Input = buildField(BaseInput, getInputProps)
Input = React.memo(Input, _.isEqual)
Input.defaultProps = {defaultSubmitStrategy: 'blur'}

const LegacyInput = makeLegacyField(BaseInput, {
  className: 'eitje-input-container',
})
LegacyInput.defaultProps = {defaultSubmitStrategy: 'blur'}

let Switch = buildField(RawSwitch, {className: 'eitje-switch-container', clearIcon: false, inputPosition: 'right'})
Switch = React.memo(Switch, _.isEqual)
const LegacySwitch = makeLegacyField(RawSwitch, {
  className: 'eitje-switch-container',
})

let Checkbox = buildField(RawCheckbox, {
  className: 'eitje-checkbox-container',
  withIcon: false,
  clearIcon: false,
})
Checkbox = React.memo(Checkbox, _.isEqual)
const LegacyCheckbox = makeLegacyField(RawCheckbox, {
  className: 'eitje-checkbox-container',
})

let DatePicker = buildField(RawDatePicker, {
  className: 'eitje-date-picker-container',
  icon: true,
})
DatePicker = React.memo(DatePicker, _.isEqual)
const LegacyDatePicker = makeLegacyField(RawDatePicker, {
  className: 'eitje-date-picker-container',
})

let TimePicker = buildField(RawTimePicker, {
  className: 'eitje-time-picker-container',
  icon: true,
})
TimePicker = React.memo(TimePicker, _.isEqual)
const LegacyTimePicker = makeLegacyField(RawTimePicker, {
  className: 'eitje-time-picker-container',
})

const FormRow = ({children, ...props}) => {
  const childrenAmt = utils.alwaysArray(children).length
  const columns = '1fr '.repeat(childrenAmt).trimEnd()

  return (
    <div {...props} style={{'--columns': columns}} className="eitje-form-3-row">
      {children}
    </div>
  )
}
const NewFormRow = FormRow

export {
  DropdownPicker,
  RawDropdownPicker,
  LegacyDropdownPicker,
  DatePicker,
  RawDatePicker,
  LegacyDatePicker,
  Checkbox,
  LegacyCheckbox,
  Input,
  RawCheckbox,
  BaseInput,
  LegacyInput,
  Switch,
  RawSwitch,
  LegacySwitch,
  buildField,
  RawTimePicker,
  TimePicker,
  FormRow,
  NewFormRow,
  LegacyTimePicker,
}
