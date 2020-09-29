import React from 'react'
import DatingMatchComponent from 'components/DatingMatch'
import DatingMatchServiceComponent from 'components/DatingMatch/index.service'

class DatingMatchScreen extends React.Component {
  render() {
    return (
      <DatingMatchServiceComponent>
        {(profileEditProps) => (
          <DatingMatchComponent
            {...profileEditProps}
          />
        )}
      </DatingMatchServiceComponent>
    )
  }
}

export default DatingMatchScreen