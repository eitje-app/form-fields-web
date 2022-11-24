import React, {Component, Fragment, useRef} from 'react'
import {
  Select as AntSelect,
  Input as AntInput,
  InputNumber as AntInputNumber,
  DatePicker as AntDatePicker,
  Popover,
  Switch as AntSwitch,
  TimePicker as AntTimePicker,
  Checkbox as AntCheckbox,
} from 'antd'
import moment from 'moment'
import {useFormField, usePicker, makeField, makeLegacyField, t} from '@eitje/form'
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

const BaseInput = (props) => {
  const {
    value,
    secure,
    textarea,
    suffix,
    charCounterProps = {},
    innerRef,
    hideCharCounter,
    maxLength,
    autocomplete = 'nope',
    autoSize = {minRows: 2, maxRows: 12},
    ...rest
  } = props
  const InputEl = textarea ? AntInput.TextArea : secure ? AntInput.Password : AntInput
  const _suffix = utils.funcOrVal(suffix, props)
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
      />
      {!!maxLength && !hideCharCounter && <CharCounter value={value} maxLength={maxLength} {...charCounterProps} />}
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

const Input = makeField(BaseInput, {className: getInputClassName, withClearIcon: true})
const getInputClassName = (props) => {
  return utils.makeCns(
    'eitje-input-container',
    props.textarea && 'eitje-input-container-textarea',
    props.password && 'eitje-input-container-password',
  )
}
const LegacyInput = makeLegacyField(BaseInput, {className: 'eitje-input-container'})

Input.defaultProps = {defaultSubmitStrategy: 'blur'}
LegacyInput.defaultProps = {defaultSubmitStrategy: 'blur'}

const PopoverContent = ({items, renderItem, value, onChange}) => {
  return (
    <div className="avatarPopOverSelectorSpace" style={{display: 'flex', flexWrap: 'wrap', width: '200px'}}>
      {items.map((i) => renderItem(i, {active: i === value, onChange}))}
    </div>
  )
}

export const PopoverPicker = (props) => {
  let {urls, SelectedEl, renderItem, border, items, Container = 'div', containerProps = {}, containerStyle = {}, popoverProps = {}} = props
  const {value, disabled, label, error} = useFormField(props)
  return (
    <div style={{opacity: disabled ? 0.2 : 1, ...containerStyle}}>
      {label && label}
      <Container {...containerProps}>
        <Popover
          trigger={disabled ? 'contextMenu' : 'hover'}
          content={<PopoverContent renderItem={renderItem} items={items} onChange={props.onChange} value={value} {...popoverProps} />}
        >
          <div>
            <SelectedEl value={value} />
          </div>
        </Popover>
      </Container>

      {error && error}
    </div>
  )
}

const RawSwitch = (props) => {
  const {value} = props
  return <AntSwitch className="eitje-switch" {...props} checked={!!value} />
}

const Switch = makeField(RawSwitch, {className: 'eitje-switch-container'})
const LegacySwitch = makeLegacyField(RawSwitch, {className: 'eitje-switch-container'})

const RawCheckbox = (props) => {
  const {value, innerRef, onChange = _.noop} = props
  return <AntCheckbox ref={innerRef} className="eitje-checkbox" {...props} onChange={(e) => onChange(e.target.checked)} checked={!!value} />
}

const Checkbox = makeField(RawCheckbox, {className: 'eitje-checkbox-container', withIcon: false})
const LegacyCheckbox = makeLegacyField(RawCheckbox, {className: 'eitje-checkbox-container'})

const searchOpts = {
  filterOption: (input, option) => {
    const normalized = option.children
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
    return normalized.indexOf(input.toLowerCase()) >= 0
  },
  optionFilterProp: 'children',
  showSearch: true,
}

const findKey = (item) => item.key || item.value

const RawDropdownPicker = (props) => {
  const {
    value,
    innerClass,
    label,
    readOnly,
    items = [],
    minSelected,
    error,
    multiple,
    showSearch = items.length > 5,
    style = {},
    selectAll,
    setOpen = _.noop,
    ...rest
  } = props
  const {pickerItems, selectedBaseItem, selectedItems} = usePicker(props)
  let condOpts = showSearch ? searchOpts : {}
  if (readOnly) style['pointerEvents'] = 'none'

  const disallowRemove = minSelected && value && value.length <= minSelected

  if (disallowRemove) {
    condOpts['removeIcon'] = null
  }

  if (readOnly) condOpts['showArrow'] = false

  const _selectAll = (value, items) => {
    if (!utils.exists(value)) return props.onChange(items.map((i) => i.value))
    return props.onChange(multiple ? [] : null)
  }
  const classNames = utils.makeCns(innerClass, 'eitje-dropdown')
  return (
    <Fragment>
      <AntSelect
        {...condOpts}
        style={style}
        mode={multiple ? 'multiple' : 'default'}
        onDropdownVisibleChange={setOpen}
        {...rest}
        value={value}
        className={classNames}
      >
        {pickerItems.map((i, idx) => (
          <Option disabled={disallowRemove && value.includes(i.value)} key={findKey(i) || idx} value={i.value}>
            {i.label}
          </Option>
        ))}
      </AntSelect>
      {selectAll && (
        <p onClick={() => _selectAll(value, pickerItems)} className="eitje-form-2-select-all">
          {t('common.select_all')}
        </p>
      )}
    </Fragment>
  )
}

const _withIcon = (props) => !props.selectAll

const defaultDropdownValue = (props) => {
  if (props.multiple) return []
  return null
}

const DropdownPicker = makeField(RawDropdownPicker, {
  className: getDropdownPickerClassName,
  withClearIcon: _withIcon,
  withIcon: _withIcon,
  defaultPickerValue: defaultDropdownValue,
})

const getDropdownPickerClassNane = (props) => {
  return utils.makeCns('eitje-dropdown-container', props.multiple && 'eitje-dropdown-container-multiple')
}
const LegacyDropdownPicker = makeLegacyField(RawDropdownPicker, {className: 'eitje-dropdown-container'})

const defaultFormat = ['DD-MM-YYYY', 'YYYY-MM-DD']

const disabledAfterToday = (date) => date && date.endOf('day') <= moment().endOf('day')
const disabledBeforeToday = (date) => date && date.endOf('day') >= moment().endOf('day')

const disabledTodayAndBefore = (date) => date && date.endOf('day') > moment().endOf('day')
const disabledTodayAndAfter = (date) => date && date.endOf('day') < moment().endOf('day')

const isDateDisabled = (
  date,
  {
    disabledAfter,
    disabledBefore,
    disabledRanges,
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

  let _disabledAfter = utils.funcOrObj(disabledAfter, formData)
  let _disabledBefore = utils.funcOrObj(disabledBefore, formData)

  if (futureDisabled) valid = disabledAfterToday(date)

  if (futureDisabledToday && valid) valid = disabledTodayAndAfter(date)

  if (isStart && valid && formData[endDateField]) {
    valid = date < moment(formData[endDateField], defaultFormat).startOf('day')
  }

  if (isEnd && valid && formData[startDateField]) {
    valid = date > moment(formData[startDateField], defaultFormat).startOf('day')
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
    valid = !disabledRanges.some((r) => r.contains(date))
  }

  return !valid
}

const RawDatePicker = (props) => {
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
  const val = value ? moment(value, _defaultFormat) : val

  const condProps = {}
  let extraFooter
  if (readOnly) {
    condProps['open'] = false
    condProps['allowClear'] = false
  }

  const _defPickerValue = utils.funcOrObj(value || defaultPickerValue, formData)
  const defPickerValue = _defPickerValue && moment(_defPickerValue, _defaultFormat)

  if (_.isFunction(renderExtraFooter)) {
    condProps['renderExtraFooter'] = () => renderExtraFooter({value: val, onChange, startValue: formData['start_date'], picker})
    condProps['dropdownClassName'] = 'has-extra-footer'
  }

  return (
    <Fragment>
      <AntDatePicker
        ref={picker}
        {...condProps}
        className={`${innerClass} eitje-date-picker`}
        disabledDate={(date) => isDateDisabled(date, props)}
        format={_defaultFormat}
        {...rest}
        value={val}
        onChange={(date, dateString) => onChange(dateString)}
        defaultPickerValue={defPickerValue}
      />
    </Fragment>
  )
}

const DatePicker = makeField(RawDatePicker, {className: 'eitje-date-picker-container'})
const LegacyDatePicker = makeLegacyField(RawDatePicker, {className: 'eitje-date-picker-container'})

const RawTimePicker = ({innerClass, pastDisabled, value, defaultOpenValue = '12:00', futureDisabled, onChange, readOnly, ...rest}) => {
  const val = value ? moment(value, 'HH:mm') : value
  const defOpenValue = moment(defaultOpenValue, 'HH:mm')

  const condProps = {}
  if (readOnly) {
    condProps['open'] = false
    condProps['allowClear'] = false
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
      onSelect={(date) => onChange(date.format('HH:mm'))}
    />
  )
}

const TimePicker = makeField(RawTimePicker, {className: 'eitje-time-picker-container'})
const LegacyTimePicker = makeLegacyField(RawTimePicker, {className: 'eitje-time-picker-container'})

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
  RawTimePicker,
  TimePicker,
  LegacyTimePicker,
}

// 3 form smaken: editable, readonly & disabled.
