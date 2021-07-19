import React from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, View, Alert } from 'react-native'
import DefaultButton from 'components/Formik/Button/DefaultButton'
import { Text } from 'react-native-paper'

import { withTheme } from 'react-native-paper'
import { withTranslation } from 'react-i18next'
import testIDs from './test-ids'

const ProfileDelete = ({ t, theme, usersDelete, usersDeleteRequest }) => {
  const styling = styles(theme)
  const isLoading = usersDelete.status === 'loading'

  const handleProfileDelete = () => {
    Alert.alert(
      t('Profile Delete'),
      t('Your profile will be deleted permanently!'),
      [
        {
          text: t('Delete now'),
          onPress: usersDeleteRequest,
        },
        {
          text: t('Cancel'),
          style: 'cancel',
        },
      ],
      { cancelable: true },
    )
  }

  return (
    <View style={styling.root}>
      <DefaultButton
        testID={testIDs.actions.deleteProfileBtn}
        mode="outlined"
        color={theme.colors.text}
        label={t('Delete Your Profile')}
        onPress={handleProfileDelete}
        loading={isLoading}
        disabled={isLoading}
      />
      <Text style={styling.text}>{t('Be aware that this action is non-reversible!')}</Text>
    </View>
  )
}

const styles = (theme) =>
  StyleSheet.create({
    root: {
      flex: 1,
      justifyContent: 'center',
      paddingVertical: theme.spacing.base,
    },
    text: {
      marginVertical: theme.spacing.base,
      textAlign: 'center',
      color: theme.colors.placeholder,
    },
  })

ProfileDelete.propTypes = {
  t: PropTypes.any,
  theme: PropTypes.any,
  usersDelete: PropTypes.any,
  usersDeleteRequest: PropTypes.any,
}

export default withTranslation()(withTheme(ProfileDelete))
