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

export default PopoverPicker
