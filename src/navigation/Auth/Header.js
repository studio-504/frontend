import React from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native'
import PropTypes from 'prop-types'
import CloseIcon from 'assets/svg/header/Close'
import BackIcon from 'assets/svg/header/Back'
import { withTheme, Text } from 'react-native-paper'

const AuthHeader = withTheme(({ theme, title, handleLeftPress, handleRightPress }) => {
  const styling = styles(theme)

  return (
    <View style={styling.root}>
      <View style={styling.component}>
        <View style={styling.left}>
          {handleLeftPress ?
            <TouchableOpacity onPress={handleLeftPress}>
              <BackIcon fill={theme.colors.text} />
            </TouchableOpacity>
          : null}
        </View>
        <View style={styling.title}>
          <Text style={styling.text}>{title}</Text>
        </View>
        <View style={styling.right}>
          {handleRightPress ?
            <TouchableOpacity onPress={handleRightPress}>
              <CloseIcon fill={theme.colors.text} />
            </TouchableOpacity>
          : null}
        </View>
      </View>
    </View>
  )
})

const Header = ({ scene, navigation }) => {
  const { options } = scene.descriptor
  const title =
    options.headerTitle !== undefined
      ? options.headerTitle
      : options.title !== undefined
      ? options.title
      : scene.route.name

  return (
    <AuthHeader
      navigation={navigation}
      title={title}
      handleLeftPress={options.handleLeftPress}
      handleRightPress={options.handleRightPress}
    />
  )
}

Header.propTypes = {
  scene: PropTypes.any,
  navigation: PropTypes.any,
  handleLeftPress: PropTypes.any,
  handleRightPress: PropTypes.any,
}

const styles = (theme) => StyleSheet.create({
  root: {
    height: 60,
    backgroundColor: theme.colors.backgroundSecondary,
  },
  component: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
  },
  left: {
    width: 24,
    marginHorizontal: theme.spacing.base,
  },
  title: {
  },
  right: {
    width: 24,
    marginHorizontal: theme.spacing.base,
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
  },
})

export default Header
