import React from 'react'
import { renderWithProviders, fireEvent } from 'tests/utils'
import ProfilePhoto from 'components/ProfilePhoto'
import CircleAvatar from 'templates/CircleAvatar'
import { confirm } from 'components/Alert'

jest.mock('@react-navigation/native', () => ({ useNavigation: jest.fn() }))
jest.mock('templates/CircleAvatar', () => jest.fn().mockReturnValue(null))
jest.mock('components/Alert', () => ({ confirm: jest.fn() }))

const handleLibrarySnap = jest.fn()
const navigateCamera = jest.fn()
const handleSkipUpload = jest.fn()
const openUploadAvatarMenu = jest.fn()

const requiredProps = {
  handleLibrarySnap,
  navigateCamera,
  handleSkipUpload,
  openUploadAvatarMenu,
}

const setup = (props) => renderWithProviders(<ProfilePhoto {...requiredProps} {...props} />)

describe('Profile Picture screen', () => {
  afterEach(() => {
    handleLibrarySnap.mockClear()
    navigateCamera.mockClear()
    handleSkipUpload.mockClear()
    openUploadAvatarMenu.mockClear()
    confirm.mockClear()
  })

  it('represent header', () => {
    const { getByText } = setup()

    getByText('Add an Unmodified Profile Picture')
    getByText('The only thing you have to change, is nothing at all!')

    expect(CircleAvatar).toHaveBeenCalled()
  })

  it('Skip Photo Upload', () => {
    const { getByText } = setup()

    fireEvent.press(getByText('Skip Photo Upload'))
    expect(handleSkipUpload).toHaveBeenCalled()
  })

  it('Take a Photo', () => {
    const { getByText } = setup()

    fireEvent.press(getByText('Take a Photo'))
    expect(confirm).toHaveBeenCalled()

    const { onConfirm, ...props } = confirm.mock.calls[0][0]
    expect(props).toEqual({
      desc: 'Your photo will be uploaded as post',
      title: 'Profile Picture Upload',
    })

    onConfirm()
    expect(navigateCamera).toHaveBeenCalled()
  })

  it('Choose From Gallery', () => {
    const { getByText } = setup()

    fireEvent.press(getByText('Choose From Gallery'))
    expect(confirm).toHaveBeenCalled()

    const { onConfirm, ...props } = confirm.mock.calls[0][0]
    expect(props).toEqual({
      desc: 'Your photo will be uploaded as post',
      title: 'Profile Picture Upload',
    })

    onConfirm()
    expect(handleLibrarySnap).toHaveBeenCalled()
  })

  it('Change Profile Picture', () => {
    const { getByText } = setup({ isAvatarEmpty: false })

    fireEvent.press(getByText('Change Profile Picture'))

    expect(openUploadAvatarMenu).toHaveBeenCalled()
  })
})
