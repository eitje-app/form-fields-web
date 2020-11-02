import React, {Component, Fragment} from 'react'
import {Select as AntSelect, Input as AntInput, InputNumber as AntInputNumber, DatePicker as AntDatePicker, Popover, Switch as AntSwitch} from 'antd'
import moment from 'moment'
import {useFormField, usePicker, makeField} from '@eitje/form'

export const Input = (props) => {
  const {className = "", value, secure, ...rest} = props
  const {disabled, label, error} = useFormField(props) 
  const InputEl = secure ? AntInput.Password : AntInput
  const classNames = [error && 'has-error', className].filter(
    Boolean,
  ).join(" ")

  return (
      <div>
        {label && label}
        <InputEl {...rest} value={value} className={classNames} onChange={e => props.onChange(e.target.value)}/>
        {error && error}
      </div>
    )
}




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


export const Switch = props => {
  const {containerStyle = {} } = props
  const {value, disabled, label, error} = useFormField(props)
  return (
    <div style={{opacity: disabled ? 0.2 : 1, ...containerStyle}}>
      {label && label}
      <AntSwitch {...props} checked={!!value} />
      {error && error}
    </div>
  )
}

const searchOpts = {
  filterOption: (input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0,
  optionFilterProp: 'children'
}

let DropdownPicker = props => {
  const {value, disabled, innerClass, label, error, multiple, showSearch, ...rest} = props
  const {pickerItems, selectedBaseItem, selectedItem} = usePicker(props)
  let condOpts = showSearch ? searchOpts : {}

  return (
      <Fragment>
          <AntSelect {...condOpts} style={{width: '50%'}} mode={multiple ? 'multiple' : 'default'} 
                     {...rest} value={value} className={innerClass}>
            {pickerItems.map(i => 
              <Option key={i.key} value={i.value}> 
                {i.label} 
              </Option>)}
           </AntSelect>
            
        </Fragment>
    )
}



DropdownPicker = makeField(DropdownPicker)


const defaultFormat = "DD-MM-YYYY"


let DatePicker = ({innerClass, onChange, value, ...rest}) => {
  const val = value ? moment(value, defaultFormat) : val
 return (
  <AntDatePicker format={defaultFormat} placeholder="Select date.." className={innerClass}
                  {...rest} value={val} onChange={(date, dateString) => onChange(dateString) }/>
                 
                 )
}




DatePicker = makeField(DatePicker)

export {DropdownPicker, DatePicker}









