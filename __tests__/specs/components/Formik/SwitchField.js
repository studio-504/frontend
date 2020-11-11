import React from 'react'
import { renderWithProviders } from 'tests/utils'
import SwitchField from 'components/Formik/SwitchField'
import { testField } from 'tests/utils/helpers'

const label = 'Label'
const field = { name: 'name', value: true }
const changeField = jest.fn()
const form = { handleChange: jest.fn().mockReturnValue(changeField), setFieldValue: jest.fn() }
const requiredProps = { field, form, label }

const setup = (props) => renderWithProviders(<SwitchField {...requiredProps} {...props} />)

describe('SwitchField', () => {
  it('label', () => {
    const { getByText } = setup()

    expect(getByText(label)).toBeTruthy()
  })

  it('switch', () => {
    const { getByRole } = setup()

    expect(getByRole('switch')).toBeTruthy()
    testField(getByRole('switch'), { value: field.value })
  })
})
