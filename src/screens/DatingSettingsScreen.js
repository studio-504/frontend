import React from 'react'
import DatingSettings from 'components/DatingSettings'
import DatingSettingsService from 'components/DatingSettings/index.service'
import PermissionsComponent from 'components/Permissions'
import PermissionsServiceComponent from 'components/Permissions/index.service'

class DatingSettingsScreen extends React.Component {
  render() {
    return (
      <PermissionsServiceComponent location>
        {(permissionsProps) => (
          <React.Fragment>
            {!permissionsProps.locationEnabled ?
              <PermissionsComponent
                {...permissionsProps}
                location
              />
            : null}

            <DatingSettingsService>
              {(datingProps) => (
                <DatingSettings
                  {...datingProps}
                />
              )}
            </DatingSettingsService>
          </React.Fragment>
        )}
      </PermissionsServiceComponent>
    )
  }
}

export default DatingSettingsScreen