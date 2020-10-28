import React, { useRef } from 'react'
import UploadAvatarComponent from 'components/UploadAvatar/component'
import UploadAvatarService from 'components/UploadAvatar/index.service'

const UploadAvatar = ({ children }) => {
  const actionSheetRef = useRef(null)
  const openUploadAvatarMenu = () => actionSheetRef.current && actionSheetRef.current.show()

  return (
    <UploadAvatarService>
      {({ isAvatarEmpty, ...props }) => (
        <>
          {children({ openUploadAvatarMenu, isAvatarEmpty })}
          <UploadAvatarComponent {...props} isAvatarEmpty={isAvatarEmpty} actionSheetRef={actionSheetRef} />
        </>
      )}
    </UploadAvatarService>
  )
}

export default UploadAvatar
