import React from 'react'
import PropTypes from 'prop-types'
import UploadAvatar from 'components/UploadAvatar'

const ProfilePhotoService = ({ children }) => {
  return <UploadAvatar backRoute="ProfileSelf">{children}</UploadAvatar>
}

ProfilePhotoService.propTypes = {
  children: PropTypes.any,
}

export default ProfilePhotoService
