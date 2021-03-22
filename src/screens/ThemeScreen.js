import React from 'react'
import ThemeComponent from 'components/Theme'
import ThemeServiceComponent from 'components/Theme/index.service'
import ThemeModalComponent from 'components/ThemeModal'
import FeedScreen from 'screens/FeedScreen'
import { Provider as PaperProvider } from 'react-native-paper'

class ThemeScreen extends React.Component {
  render() {
    return (
      <ThemeServiceComponent>
        {(props) => (
          <React.Fragment>
            {props.appThemePreview !== null ?
              <ThemeModalComponent
                isVisible
                onApplyClick={() => props.appThemePreviewUpdate(props.appThemePreview.key)}
                onDiscardClick={props.appThemePreviewIdle}
              >
                <PaperProvider theme={props.appThemePreview.theme}>
                  <FeedScreen />
                </PaperProvider>
              </ThemeModalComponent>
            : null}

            <ThemeComponent
              {...props}
            />
          </React.Fragment>
        )}
      </ThemeServiceComponent>
    )
  }
}

export default ThemeScreen
