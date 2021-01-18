import React from 'react'
import PropTypes from 'prop-types'
import {
  StyleSheet,
  View,
  ScrollView,
} from 'react-native'
import { Text } from 'react-native-paper'
import RowsComponent from 'templates/Rows'
import RowsItemComponent from 'templates/RowsItem'
import UserRowComponent from 'templates/UserRow'
import ThemeRowActionComponent from 'templates/ThemeRowAction'
import path from 'ramda/src/path'
import ThemeAvatar from 'templates/ThemeAvatar'
import themesJson from 'assets/themes.json'

import { withTheme } from 'react-native-paper'
import { withTranslation } from 'react-i18next'

const DEFAULT_THEME = 'white.green'

const Theme = ({
  t,
  theme,
  user,
  appThemePreviewRequest,
  appThemePreviewUpdate,
}) => {
  const styling = styles(theme)
  
  return (
    <ScrollView style={styling.root}>
      <RowsComponent items={themesJson}>
        {(theme) => (
          <RowsItemComponent>
            <UserRowComponent
              avatar={
                <ThemeAvatar
                  size="default"
                  colors={[
                    theme.theme.colors.button,
                    theme.theme.colors.backgroundPrimary,
                  ]}
                />
              }
              content={
                <View>
                  {/*
                   * Available values coming from json resource
                   *
                   * White & Green
                   * Black & Green
                   * White & Red
                   * Black & Red
                   */}
                  <Text style={styling.username}>{t(path(['label'])(theme))}</Text>
                </View>
              }
              action={
                <ThemeRowActionComponent
                  enabled={user.themeCode === theme.key}
                  onEnablePress={() => appThemePreviewRequest(theme)}
                  onDisablePress={() => appThemePreviewUpdate(DEFAULT_THEME)}
                />
              }
            />
          </RowsItemComponent>
        )}
      </RowsComponent>
    </ScrollView>
  )
}

const styles = theme => StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.backgroundPrimary,
    padding: theme.spacing.base,
  },
  form: {
    padding: theme.spacing.base,
  },
})

Theme.propTypes = {
  t: PropTypes.any,
  theme: PropTypes.any,
  user: PropTypes.any,
  appThemePreviewRequest: PropTypes.func,
  appThemePreviewUpdate: PropTypes.func,
}

export default withTranslation()(withTheme(Theme))
