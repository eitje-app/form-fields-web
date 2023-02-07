import React, {Component, Fragment, useRef} from 'react'
import {Select as AntSelect} from 'antd'
import moment from 'moment'
import {useFormField, usePicker, makeField, makeLegacyField, makeRegisteredField, t} from '@eitje/form'
import utils from '@eitje/utils'

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

const DropdownPicker = (props) => {
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
export default DropdownPicker
