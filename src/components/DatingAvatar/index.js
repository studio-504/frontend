import React from 'react'
import PropTypes from 'prop-types'
import { View, StyleSheet } from 'react-native'
import ProfilePhotoComponent from 'components/ProfilePhoto'
import DefaultButton from 'components/Formik/Button/DefaultButton'
import { withTranslation } from 'react-i18next'

const DatingAvatar = ({ t, handleNext, isAvatarEmpty, ...props }) => {
  return (
    <View style={styles.root}>
      <ProfilePhotoComponent isAvatarEmpty={isAvatarEmpty} {...props} />
      {!isAvatarEmpty ? (
        <View style={styles.footer}>
          <DefaultButton label={t('Next')} onPress={handleNext} />
        </View>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  footer: {
    paddingHorizontal: 24,
  },
})

DatingAvatar.propTypes = {
  t: PropTypes.any,
  handleNext: PropTypes.func,
  isAvatarEmpty: PropTypes.bool,
}

DatingAvatar.defaultProps = {
  isAvatarEmpty: true,
}

export default withTranslation()(DatingAvatar)
