import React from 'react'
import ToggleButton from 'components/ToggleButton'
import { renderWithProviders, within, fireEvent } from 'tests/utils'

const onChange = jest.fn()
const requiredProps = { onChange }
const options = [
  { label: 'Label 1', value: 'value 1' },
  { label: 'Label 2', value: 'value 2' },
  { label: 'Label 3', value: 'value 3' },
]

const setup = (props) => renderWithProviders(<ToggleButton {...requiredProps} {...props} />)

describe('ToggleButton', () => {
  afterEach(() => {
    onChange.mockClear()
  })

  it('empty', () => {
    const { queryAllByRole } = setup()

    expect(queryAllByRole('radiogroup')).toBeTruthy()
    expect(queryAllByRole('radio')).toHaveLength(0)
  })

  it('render options', () => {
    const { queryAllByRole } = setup({ options })
    const $options = queryAllByRole('radio')

    expect($options).toHaveLength(options.length)

    $options.forEach(($item, index) => {
      expect(within($item).queryByText(options[index].label)).toBeTruthy()
    })
  })

  it('selected item', () => {
    const selectedIndex = 1
    const value = options[selectedIndex].value
    const { queryAllByRole } = setup({ options, value })
    const $options = queryAllByRole('radio')

    $options.forEach(($item, index) => {
      fireEvent.press($item)

      if (index === selectedIndex) {
        expect(onChange).not.toHaveBeenCalled()
      } else {
        expect(onChange).toHaveBeenCalledWith(options[index].value)
      }

      onChange.mockClear()
    })
  })
})
