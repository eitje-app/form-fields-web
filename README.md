Great fields, to be used together with eitje-app/forms

## General props

These props are shared by every field

| Key        | Explanation           | Default value  |
| ------------- |:-------------:| -----:|
| field     | name of the field in formData, will also be used for validations  |   |
| name | More granular control: validation will first look for the name prop before looking for the field prop. This way you can have different validations for the same field in different places     |     |
| required    |  is this field required for submitting?  |  false |
| validate | Custom validation function with (formData, field) as arguments     |     |
| validateMessage | Custom validation message |     |
| disabled | disabled can be a bool or a function that takes formData as first argument |     |
| label | label to be rendered alongside the field.  This can be either a string, React node or a function. In case of a function, all element props will be passed to the label  |  p tag with name OR field.   |
| labelStyle | style to be applied to the default label (NOTE: does only work if you pass nothing or a string) | {} |
| labelVisible | hides the label when true | false |
| style | style to be applied to the form element | {} |
| namespace | namespace to put its serialized data into (useful for creating nested data structures) |  |
| containerStyle | style object to be applied to the container  |  {}   |
| containerProps | props object to be applied to the container | {} |
| Container | override container component altogether | div |
| disabledStyle | style to be applied to the container when the field is disabled | {opacity: 0.2} |
| readOnly | disables the input but does not apply disabled styling | false |
| submitStrategy | the strategy to submit this field, can either be blur, change or inlineButton (spawns a button next to the input for user confirmation). If left open field can only be submitted through the form. NOTE: submitStrategy only submits the field being changed | null




## Input

Simple text input

| Key        | Explanation           | Default value  |
| ------------- |:-------------:| -----:|
| secure     | if true renders a secure password input | false   |

## Dropdown picker

Renders an antd dropdown picker

| Key        | Explanation           | Default value  |
| ------------- |:-------------:| -----:|
| items     | array of objects to be selected from  | []   |
| valueField | The property that you want to use as value  |  id   |
| labelField    |  The property that you want to use as label |  false |
| noSort | Do not sort alphabetically     | false     |
| modifyItems | map function ran after dropdown picker converts the items into pickerItems, useful for adding an irregular option |     |
| showSearch | allow users to search this picker | false    |
| multiple | is multiple selection allowed?  | false     |
| innerClass | className for the inner antd element |     |


## Date picker

| Key        | Explanation           | Default value  |
| ------------- |:-------------:| -----:|
| innerClass     | className for the inner antd elemtn  |    |




## Switch

No extra props



