import React, {Component, Fragment, useRef} from 'react'
import {Switch as AntSwitch, Checkbox as AntCheckbox} from 'antd'
import RawDropdownPicker from './fields/dropdown'
import RawTimePicker from './fields/time_picker'
import RawDatePicker from './fields/date_picker'
import PopoverPicker from './fields/popover_picker'
import BaseInput from './fields/input'
import {
  useFormField,
  usePicker,
  makeField,
  makeNewField,
  makeLegacyField,
  makeNewRegisteredField,
  makeRegisteredField,
  useForm,
  config,
  t,
} from '@eitje/form'
import utils from '@eitje/utils'

const _buildField = components => props => {
  const {Full, Form, Base, New} = components
  const {form = true, decorated = true, raw} = props
  const {form: formInstance} = useForm()
  const isNew = formInstance?.constructor?.name == 'NewForm'
  if (isNew) return <New {...props} newForm />
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

const Input = buildField(BaseInput, getInputProps)
Input.defaultProps = {defaultSubmitStrategy: 'blur'}
const LegacyInput = makeLegacyField(BaseInput, {
  className: 'eitje-input-container',
})
LegacyInput.defaultProps = {defaultSubmitStrategy: 'blur'}

const Switch = buildField(RawSwitch, {className: 'eitje-switch-container'})
const LegacySwitch = makeLegacyField(RawSwitch, {
  className: 'eitje-switch-container',
})

const Checkbox = buildField(RawCheckbox, {
  className: 'eitje-checkbox-container',
  withIcon: false,
})
const LegacyCheckbox = makeLegacyField(RawCheckbox, {
  className: 'eitje-checkbox-container',
})

const DatePicker = buildField(RawDatePicker, {
  className: 'eitje-date-picker-container',
})
const LegacyDatePicker = makeLegacyField(RawDatePicker, {
  className: 'eitje-date-picker-container',
})

const TimePicker = buildField(RawTimePicker, {
  className: 'eitje-time-picker-container',
})
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
