import React, {Component, Fragment, useRef} from 'react'
import {Select as AntSelect, Input as AntInput, InputNumber as AntInputNumber, DatePicker as AntDatePicker, Popover, Switch as AntSwitch, TimePicker as AntTimePicker} from 'antd'
import moment from 'moment'
import {useFormField, usePicker, makeField} from '@eitje/form'
import utils from '@eitje/utils'

const change = (props, val, event) => {
  const {formatValue, onChange} = props
  let newVal = val;
  if(formatValue) {
    newVal = formatValue(val); 
    if(_.isNaN(newVal)) return;
  }

  onChange(newVal, event)
}

const BaseInput = (props) => {
  const {value, secure, textarea, innerRef, hideCharCounter, maxLength, ...rest} = props
  const InputEl = textarea ? AntInput.TextArea : secure ? AntInput.Password : AntInput
  return (
      <Fragment>
        <InputEl ref={innerRef} maxLength={maxLength} {...rest} value={value} 
                 onChange={e => change(props, e.target.value, e)}/>
        {!!maxLength && !hideCharCounter && <CharCounter value={value} maxLength={maxLength}/> }
      </Fragment>
    )
}

const getColor = (charsLeft) => {
  if(charsLeft < 5) return 'red'
  if(charsLeft < 10) return 'orange'
  return 'black'
}


const CharCounter = ({maxLength, value = ""}) => {
  const charsLeft = maxLength - (value?.length || 0)
  return (
        <p className="char-counter" style={{color: getColor(charsLeft)}}>{charsLeft} / {maxLength}</p>
    )
}


const Input = makeField(BaseInput)
Input.defaultProps = {defaultSubmitStrategy: 'blur'}

const PopoverContent = ({items, renderItem, value, onChange}) => {
  return (
      <div className='avatarPopOverSelectorSpace' style={{ display: 'flex', flexWrap: 'wrap', width: '200px' }}>
        {items.map(i => renderItem(i, {active: i === value, onChange} ) )}
      </div>
    )
}


export const PopoverPicker = props => {
  let {urls, SelectedEl, renderItem, border, items, Container = "div", containerProps = {}, containerStyle = {}, popoverProps = {}} = props
  const {value, disabled, label, error} = useFormField(props)
  return (

  <div style={{opacity: disabled ? 0.2 : 1, ...containerStyle}}>
    {label && label}
  <Container {...containerProps} >
  
    <Popover trigger={disabled ? 'contextMenu' : 'hover'} 
             content={<PopoverContent renderItem={renderItem} items={items} onChange={props.onChange} value={value} {...popoverProps} />}>
      <div>
        <SelectedEl value={value}/>
      </div>
    </Popover>
  </Container>

    {error && error}

  </div>  
  )
}

let Switch = props => {
  const {value} = props
  return (
      <AntSwitch {...props} checked={!!value} />
  )
}

Switch = makeField(Switch)

const searchOpts = {
  filterOption: (input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0,
  optionFilterProp: 'children',
  showSearch: true
}

const findKey = item => item.key || item.value 

let DropdownPicker = props => {
  const {value, innerClass, label, readOnly, minSelected, error, multiple, showSearch, style = {}, ...rest} = props
  const {pickerItems, selectedBaseItem, selectedItems} = usePicker(props)
  let condOpts = showSearch ? searchOpts : {}
  if(readOnly) style['pointerEvents'] = 'none'

  const disallowRemove = minSelected && value && value.length <= minSelected

  if(disallowRemove) {
    condOpts['removeIcon'] = null
  } 


  return (
      <Fragment>

          <AntSelect {...condOpts} style={{width:'100%', ...style}} mode={multiple ? 'multiple' : 'default'} 
                     {...rest} value={value} className={innerClass}>
            {pickerItems.map((i, idx) => 
              <Option disabled={ disallowRemove && value.includes(i.value) } key={findKey(i) || idx}value={i.value}> 
                {i.label} 
              </Option>)}
           </AntSelect>
            
        </Fragment>
    )
}



DropdownPicker = makeField(DropdownPicker)


const defaultFormat = ["DD-MM-YYYY", 'YYYY-MM-DD']

const disabledAfterToday = date => date && date.endOf('day') <= moment().endOf('day')
const disabledBeforeToday = date => date && date.endOf('day') >= moment().endOf('day')

const disabledTodayAndBefore = date => date && date.endOf('day') > moment().endOf('day')
const disabledTodayAndAfter = date => date && date.endOf('day') < moment().endOf('day')



const isDateDisabled = (date, {disabledAfter, disabledBefore, disabledRanges, formData, isStart, isEnd, field, futureDisabled, pastDisabled, pastDisabledToday, futureDisabledToday}) => {
  let valid = true
  
  let _disabledAfter = utils.funcOrObj(disabledAfter, formData)
  let _disabledBefore = utils.funcOrObj(disabledBefore, formData)


  if(futureDisabled) valid = disabledAfterToday(date); 

  if(futureDisabledToday && valid) valid = disabledTodayAndAfter(date);

  if(isStart && valid && formData['end_date']) {
    valid = date < moment(formData['end_date'], defaultFormat).startOf('day')
  }

  if(isEnd && valid && formData['start_date']) {
    valid = date > moment(formData['start_date'], defaultFormat).startOf('day')
  }

  if(pastDisabled && valid) valid = disabledBeforeToday(date);

  if(pastDisabledToday && valid) valid = disabledTodayAndBefore(date)
    

  if(_disabledAfter && valid)  {
    valid = date < moment(_disabledAfter, defaultFormat).startOf('day')
  }

  if(_disabledBefore && valid)  {
    valid = date > moment(_disabledBefore, defaultFormat).endOf('day')
  }

  if(disabledRanges && valid && date) {
    valid = !disabledRanges.some(r => r.contains(date))
  }

  return !valid;
} 



let DatePicker = (props) => {
  const picker = useRef(null)
  const {innerClass, pastDisabled, disabledBefore, disabledAfter, disabledDate, 
         futureDisabled, onChange, value, readOnly, renderExtraFooter, formData, defaultPickerValue, ...rest} = props
  const val = value ? moment(value, defaultFormat) : val
  const condProps = {}
  let extraFooter;
  if(readOnly) {
    condProps['open'] = false
    condProps['allowClear'] = false
  }

  const _defPickerValue = utils.funcOrObj(value || defaultPickerValue, formData)
  const defPickerValue = _defPickerValue && moment(_defPickerValue, defaultFormat)

  if(_.isFunction(renderExtraFooter)) {
    condProps['renderExtraFooter'] = () => renderExtraFooter({value: val, onChange, startValue: formData['start_date'], picker } )
    condProps['dropdownClassName'] = 'has-extra-footer'
  }


 return (
  
  <Fragment>
    <AntDatePicker  ref={picker} {...condProps} className={innerClass} disabledDate={date => isDateDisabled(date, props)} format={defaultFormat}
                    {...rest} value={val} onChange={(date, dateString) => onChange(dateString) } defaultPickerValue={defPickerValue}/>

  </Fragment>
                 
                 )

}




DatePicker = makeField(DatePicker)


let TimePicker = ({innerClass, pastDisabled, value, defaultOpenValue = "12:00", futureDisabled, onChange, readOnly, ...rest}) => {
  const val = value ? moment(value, 'HH:mm') : value
  const defOpenValue = moment(defaultOpenValue, 'HH:mm')

  const condProps = {}
  if(readOnly) {
    condProps['open'] = false
    condProps['allowClear'] = false
  }

 return (
  
    <AntTimePicker {...condProps} showNow={false} format="HH:mm" placeholder="Select time.." className={innerClass} minuteStep={5}
                    {...rest} value={val} defaultOpenValue={defOpenValue} onSelect={(date) => onChange(date.format("HH:mm")) }/>

                 
                 )

}




TimePicker = makeField(TimePicker)


export {DropdownPicker, DatePicker, Input, BaseInput, Switch, TimePicker}





// 3 form smaken: editable, readonly & disabled. 









