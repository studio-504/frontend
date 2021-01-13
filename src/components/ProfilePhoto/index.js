import React from 'react'
import PropTypes from 'prop-types'
import { View, StyleSheet } from 'react-native'
import AuthHeaderTemplate from 'templates/Auth/Header'
import DefaultButton from 'components/Formik/Button/DefaultButton'
import CircleAvatar from 'templates/CircleAvatar'
import { confirm } from 'components/Alert'
import { withTranslation } from 'react-i18next'
import { withTheme } from 'react-native-paper'

const ProfilePhoto = ({
  t,
  handleLibrarySnap,
  navigateCamera,
  handleSkipUpload,
  isAvatarEmpty,
  openUploadAvatarMenu,
  avatarUrl,
  required,
}) => {
  const confirmProfilePhotoUpload = (onConfirm) => () => {
    confirm({
      title: t('Profile Picture Upload'),
      desc: t('Your photo will be uploaded as post'),
      onConfirm,
    })
  }

  const actions = isAvatarEmpty
    ? [
        { label: t('Take a Photo'), onPress: confirmProfilePhotoUpload(navigateCamera) },
        { label: t('Choose From Gallery'), onPress: confirmProfilePhotoUpload(handleLibrarySnap) },
      ]
    : [{ label: t('Change Profile Picture'), onPress: openUploadAvatarMenu, mode: 'text' }]

  return (
    <View style={styles.root}>
      <AuthHeaderTemplate
        title={t('Add an Unmodified Profile Picture')}
        subtitle={t('Our AI detects photoshop & filters')}
      />
      <View>
        <View style={styles.avatar}>
          <CircleAvatar image={avatarUrl} hasBorder />
        </View>
        <View>
          {actions.map(({ label, onPress, ...props }, index) => (
            <View key={index} style={styles.item}>
              <DefaultButton label={label} onPress={onPress} {...props} />
            </View>
          ))}

          {required === false ? (
            <View style={styles.item}>
              <DefaultButton label={t('Skip Photo Upload')} onPress={handleSkipUpload} loading={false} mode="text" />
            </View>
          ) : null}
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    paddingHorizontal: 24,
  },
  item: {
    marginBottom: 12,
  },
  avatar: {
    alignItems: 'center',
    marginBottom: 24,
  },
})

ProfilePhoto.propTypes = {
  t: PropTypes.any,
  theme: PropTypes.any,
  handleLibrarySnap: PropTypes.func.isRequired,
  navigateCamera: PropTypes.func.isRequired,
  handleSkipUpload: PropTypes.func.isRequired,
  isAvatarEmpty: PropTypes.bool,
  required: PropTypes.bool,
  openUploadAvatarMenu: PropTypes.func.isRequired,
  avatarUrl: PropTypes.string,
}

ProfilePhoto.defaultProps = {
  isAvatarEmpty: true,
  required: false,
  avatarUrl: null,
}

export default withTranslation()(withTheme(ProfilePhoto))
