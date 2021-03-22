import React from 'react'
import PropTypes from 'prop-types'
import DatingAvatarComponent from 'components/DatingAvatar'
import DatingAvatarServiceComponent from 'components/DatingAvatar/index.service'

class DatingAvatarScreen extends React.Component {
  render() {
    const { handleNext } = this.props

    return (
      <DatingAvatarServiceComponent>
        {(props) => (
          <DatingAvatarComponent
            {...props}
            handleNext={handleNext}
            required
          />
        )}
      </DatingAvatarServiceComponent>
    )
  }
}

DatingAvatarScreen.propTypes = {
  handleNext: PropTypes.func,
}

DatingAvatarScreen.defaultProps = {
  handleNext: null,
}

export default DatingAvatarScreen
