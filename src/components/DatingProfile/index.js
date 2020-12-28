import React from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, View } from 'react-native'
import DatingCard from 'components/Dating/Card'
import DefaultButton from 'components/Formik/Button/DefaultButton'
import { Text } from 'react-native-paper'

import { withTheme } from 'react-native-paper'
import { withTranslation } from 'react-i18next'

const DatingProfile = ({
  t,
  theme,
  user,
  usersSetUserDatingStatus,
  usersSetUserDatingStatusRequest,
  usersImagePostsGet,
  navigateDating,
}) => {
  const styling = styles(theme)

  return (
    <View style={styling.root}>
      <View style={styling.card}>
        <DatingCard user={user} posts={usersImagePostsGet.data} />
      </View>
      <View style={styling.actions}>
        {user.datingStatus === 'ENABLED' ? 
          <DefaultButton
            style={styling.submitBtn}
            label={t('Open Dating')}
            onPress={navigateDating}
          /> : 
          <DefaultButton
            style={styling.submitBtn}
            accessibilityLabel="Submit"
            label={t('Start Dating')}
            onPress={usersSetUserDatingStatusRequest}
            loading={usersSetUserDatingStatus.status === 'loading'}
            disabled={usersSetUserDatingStatus.status === 'loading'}
          />
        }
        
        <Text style={styling.text}>{t('Preview your dating profile and start dating')}</Text>
      </View>
    </View>
  )
}

const styles = (theme) =>
  StyleSheet.create({
    root: {
      flex: 1,
    },
    card: {
      flex: 1,
      padding: theme.spacing.base,
    },
    actions: {
      paddingHorizontal: theme.spacing.base,
      marginBottom: theme.spacing.base * 2,
    },
    submitBtn: {
      marginBottom: theme.spacing.base,
    },  
    text: {
      textAlign: 'center',
    },
  })

DatingProfile.propTypes = {
  t: PropTypes.any,
  theme: PropTypes.any,
  user: PropTypes.any,
  usersSetUserDatingStatus: PropTypes.any,
  usersSetUserDatingStatusRequest: PropTypes.func,
  usersImagePostsGet: PropTypes.shape({
    data: PropTypes.array,
  }),
  navigateDating: PropTypes.func,
}

export default withTranslation()(withTheme(DatingProfile))
