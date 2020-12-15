import React, { useRef } from 'react'
import PropTypes from 'prop-types'
import UploadAvatarComponent from 'components/UploadAvatar/component'
import useProfilePhoto from 'components/UploadAvatar/index.service'

const UploadAvatar = ({ children, backRoute }) => {
  const props = useProfilePhoto({ backRoute })
  const actionSheetRef = useRef(null)
  const openUploadAvatarMenu = () => actionSheetRef.current && actionSheetRef.current.show()

  return ( 
    <React.Fragment>
      {children({ openUploadAvatarMenu, ...props })}
      <UploadAvatarComponent {...props} actionSheetRef={actionSheetRef} />
    </React.Fragment>
  )
}

UploadAvatar.propTypes = {
  children: PropTypes.any.isRequired,
  backRoute: PropTypes.string,
}

UploadAvatar.defaultProps = {
  backRoute: null,
}

export default UploadAvatar
