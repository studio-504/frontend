import React from 'react'
import ProfileEditComponent from 'components/ProfileEdit'
import ProfileEditServiceComponent from 'components/ProfileEdit/index.service'

class ProfileScreen extends React.Component {
  render() {
    return (
      <ProfileEditServiceComponent>
        {(profileEditProps) => (
          <ProfileEditComponent
            {...profileEditProps}
          />
        )}
      </ProfileEditServiceComponent>
    )
  }
}

export default ProfileScreen