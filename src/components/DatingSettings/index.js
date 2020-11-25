import React from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native'
import { withTheme, Title, Switch, Text } from 'react-native-paper'
import AuthErrorTemplate from 'templates/Auth/Error'
import RowsComponent from 'templates/Rows'
import RowsItemComponent from 'templates/RowsItem'
import UserRowComponent from 'templates/UserRow'
import SettingsAvatar from 'templates/SettingsAvatar'
import CircleAvatar from 'templates/CircleAvatar'
import EditIcon from 'assets/svg/settings/Edit'
import PhotoIcon from 'assets/svg/settings/Photo'
import NextIcon from 'assets/svg/settings/Next'
import FiltersIcon from 'assets/svg/dating/Filters'
import DiamondIcon from 'assets/svg/settings/Diamond'
import { withTranslation } from 'react-i18next'
import dayjs from 'dayjs'
import path from 'ramda/src/path'

const DatingSettings = ({
  t,
  theme,
  user,
  formErrorMessage,
  handleErrorClose,
  disableDating,
  toggleDatingStatusRequest,
  navigateDatingMatch,
  navigateDatingAbout,
  navigateMembership,
  openUploadAvatarMenu,
}) => {
  const styling = styles(theme)
  const age = user.dateOfBirth ? `, ${dayjs().diff(user.dateOfBirth, 'year')}` : null

  return (
    <ScrollView style={styling.root}>
      {formErrorMessage ? <AuthErrorTemplate text={formErrorMessage} onClose={handleErrorClose} /> : null}
      <View style={styling.header}>
        <TouchableOpacity onPress={openUploadAvatarMenu}>
          <CircleAvatar image={path(['photo', 'url480p'], user)} />
        </TouchableOpacity>
        <Text style={styling.name} numberOfLines={1} ellipsizeMode="tail">
          {user.fullName}
          {age}
        </Text>
        <Text style={styling.bio} numberOfLines={3} ellipsizeMode="tail">
          {user.bio}
        </Text>
      </View>

      <RowsComponent
        items={[
          {
            label: t('Edit Match Settings'),
            onPress: navigateDatingMatch,
            icon: <FiltersIcon fill={theme.colors.text} />,
          },
          {
            label: t('Edit Profile'),
            onPress: navigateDatingAbout,
            icon: <EditIcon fill={theme.colors.text} />,
          },
          {
            label: t('Change Profile Picture'),
            onPress: openUploadAvatarMenu,
            icon: <PhotoIcon fill={theme.colors.text} />,
          },
          {
            label: t('Join Diamond'),
            onPress: navigateMembership,
            icon: <DiamondIcon fill={theme.colors.text} />,
          },
        ]}
      >
        {(settings) => (
          <RowsItemComponent hasBorders>
            <UserRowComponent
              onPress={settings.onPress}
              avatar={<SettingsAvatar icon={settings.icon} />}
              content={<Text style={styling.username}>{settings.label}</Text>}
              action={<SettingsAvatar icon={<NextIcon fill={theme.colors.text} />} />}
            />
          </RowsItemComponent>
        )}
      </RowsComponent>
      <View style={styling.footer}>
        <Title style={styling.title}>{t('Toggle Dating')}</Title>
        <View style={styling.switch}>
          <Text style={styling.label}>{t('Dating')}</Text>
          <Switch value={!disableDating} onValueChange={toggleDatingStatusRequest} accessibilityLabel="disableDating" />
        </View>
      </View>
    </ScrollView>
  )
}

DatingSettings.propTypes = {
  t: PropTypes.any,
  theme: PropTypes.any,
  handleErrorClose: PropTypes.func,
  formErrorMessage: PropTypes.string,
  disableDating: PropTypes.bool,
  toggleDatingStatusRequest: PropTypes.func,
  navigateDatingMatch: PropTypes.func,
  navigateDatingAbout: PropTypes.func,
  navigateMembership: PropTypes.func,
  openUploadAvatarMenu: PropTypes.func,
}

DatingSettings.defaultProps = {
  formErrorMessage: null,
  disableDating: false,
}

const styles = (theme) =>
  StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: theme.colors.backgroundPrimary,
    },
    title: {
      fontSize: 12,
      textTransform: 'uppercase',
      color: '#8D9195',
    },
    switch: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    label: {
      flexGrow: 1,
      marginRight: 12,
    },
    header: {
      alignItems: 'center',
    },
    name: {
      fontSize: 24,
      fontWeight: '600',
      paddingBottom: theme.spacing.base,
    },
    bio: {
      fontSize: 16,
      fontWeight: '400',
      paddingBottom: theme.spacing.base / 2,
    },
    footer: {
      padding: theme.spacing.base,
      backgroundColor: theme.colors.backgroundSecondary,
    },
  })

export default withTranslation()(withTheme(DatingSettings))
