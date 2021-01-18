import React from 'react'
import DatingSettings from 'components/DatingSettings'
import DatingSettingsService from 'components/DatingSettings/index.service'

class DatingSettingsScreen extends React.Component {
  render() {
    return (
      <DatingSettingsService>
        {(datingProps) => (
          <DatingSettings
            {...datingProps}
          />
        )}
      </DatingSettingsService>
    )
  }
}

export default DatingSettingsScreen