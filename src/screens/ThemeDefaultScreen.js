import React from 'react'
import ThemeDefaultComponent from 'components/ThemeDefault'
import ThemeDefaultServiceComponent from 'components/ThemeDefault/index.service'

class ThemesDefaultScreen extends React.Component {
  render() {
    return (
      <ThemeDefaultServiceComponent>
        {((props) => (
          <ThemeDefaultComponent
            {...props}
          />
        ))}
      </ThemeDefaultServiceComponent>
    )
  }
}

export default ThemesDefaultScreen