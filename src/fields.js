import React, {Component, Fragment, useRef} from 'react'
import {Select as AntSelect, Input as AntInput, InputNumber as AntInputNumber, DatePicker as AntDatePicker, Popover, Switch as AntSwitch} from 'antd'
import moment from 'moment'
import {useFormField, usePicker, makeField} from '@eitje/form'


let Input = (props) => {
  const {value, secure, textarea, ...rest} = props
  const InputEl = textarea ? AntInput.TextArea : secure ? AntInput.Password : AntInput

  return (
        <InputEl {...rest} value={value} 
                 onChange={e => props.onChange(e.target.value)}/>
    )
}

Input = makeField(Input)






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
  optionFilterProp: 'children'
}



let DropdownPicker = props => {
  const {value, disabled, innerClass, label, readOnly, error, multiple, showSearch, style = {}, ...rest} = props
  const {pickerItems, selectedBaseItem, selectedItems} = usePicker(props)
  let condOpts = showSearch ? searchOpts : {}
  if(readOnly) style['pointerEvents'] = 'none'
  return (
      <Fragment>

          <AntSelect {...condOpts} style={{width: '50%', ...style}} mode={multiple ? 'multiple' : 'default'} 
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


const defaultFormat = ["DD-MM-YYYY", 'YYYY-MM-DD']


let DatePicker = ({innerClass, onChange, value, readOnly, ...rest}) => {
  const val = value ? moment(value, defaultFormat) : val
  const condProps = {}
  if(readOnly) {
    condProps['open'] = false
    condProps['allowClear'] = false
  }

 return (
  
  <Fragment>
    <AntDatePicker {...condProps} readOnly inputReadOnly format={defaultFormat} placeholder="Select date.." className={innerClass}
                    {...rest} value={val} onChange={(date, dateString) => onChange(dateString) }/>

  </Fragment>
                 
                 )

}




DatePicker = makeField(DatePicker)


export {DropdownPicker, DatePicker, Input, Switch}





// 3 form smaken: editable, readonly & disabled. 









