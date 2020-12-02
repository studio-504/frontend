import React from 'react'
import PropTypes from 'prop-types'
import {
  StyleSheet,
  View,
} from 'react-native'
import { Subheading, Text, Caption } from 'react-native-paper'
import path from 'ramda/src/path'
import dayjs from 'dayjs'
import { renderDiamond } from 'components/Post/Username'
import { withTranslation } from 'react-i18next'
import { withTheme } from 'react-native-paper'

const ProfileAbout = ({
  t,
  theme,
  usersGetProfile,
}) => {
  const user = path(['data'])(usersGetProfile)
  
  return (
    <View>
      <View style={styles.username}>
        <Subheading style={styles.fullName}>{path(['fullName'])(user)}</Subheading>
        {renderDiamond({ user, theme })}
      </View>
      {path(['bio', 'length'])(user) ?
        <Text>{path(['bio'])(user)}</Text>
      : null}
      <Caption>{t('Joined')} {dayjs(path(['signedUpAt'])(user)).from(dayjs())}</Caption>
    </View>
  )
}

const styles = StyleSheet.create({
  username: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fullName: {
    marginRight: 4,
  },
})

ProfileAbout.propTypes = {
  theme: PropTypes.any,
  usersGetProfile: PropTypes.any,
  t: PropTypes.any,
}

export default withTranslation()(withTheme(ProfileAbout))
