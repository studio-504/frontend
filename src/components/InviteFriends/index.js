import React from 'react'
import PropTypes from 'prop-types'
import color from 'color'
import { Alert, View, SafeAreaView, StyleSheet, RefreshControl, FlatList, TouchableOpacity } from 'react-native'
import { Text } from 'react-native-paper'
import { withTranslation } from 'react-i18next'
import { withTheme } from 'react-native-paper'
import ContactsIcon from 'assets/svg/contacts/Contacts'
import DefaultButton from 'components/Formik/Button/DefaultButton'
import Avatar from 'templates/Avatar'
import RowsItemComponent from 'templates/RowsItem'
import UserRowComponent from 'templates/UserRow'
import testIDs from 'components/InviteFriends/test-ids'
import * as navigationActions from 'navigation/actions'
import * as contactsConstants from 'store/ducks/contacts/constants'

const InviteFriends = ({
  t,
  theme,
  navigation,
  contactsGet,
  contactsGetRequest,
  openSettings,
  contactsInviteRequest,
  contactsFollowRequest,
  contactsCheckBonusRequest,
  contactsInvite,
}) => {
  const styling = styles(theme)
  const isLoading = contactsGet.status === 'loading'
  const isSuccess = contactsGet.status === 'success'
  const isEmpty = contactsGet.items.length === 0
  const inviteLimit = contactsConstants.CONTACTS_INVITE_LIMIT

  const handleInvitePress = (user) => {
    const emails = user.emails.map((value) => ({ value, type: 'email' }))
    const phones = user.phones.map((value) => ({ value, type: 'phone' }))
    const options = [...emails, ...phones].map((contact) => ({
      text: contact.value,
      onPress: () => contactsInviteRequest({ user, contact }),
    }))

    if (options.length === 1) {
      options[0].onPress()
    } else {
      Alert.alert(
        t('Invite {{fullName}}', { fullName: user.fullName }),
        t('Сhoose a contact'),
        [...options, { text: t('Cancel'), style: 'cancel' }],
        { cancelable: true },
      )
    }
  }

  const handleRefresh = () => {
    contactsGetRequest()
    contactsCheckBonusRequest()
  }

  const refreshControl = (
    <RefreshControl tintColor={theme.colors.border} onRefresh={handleRefresh} refreshing={isLoading} />
  )

  const renderInviteContact = ({ item }) => {
    const avatarSource = { uri: item.thumbnailPath }
    const action = contactsInvite.invited[item.contactId] ? (
      <DefaultButton label={t('Invited')} mode="outlined" size="compact" disabled />
    ) : (
      <DefaultButton label={t('Invite')} onPress={() => handleInvitePress(item)} mode="outlined" size="compact" />
    )

    return (
      <UserRowComponent
        avatar={<Avatar thumbnailSource={avatarSource} imageSource={avatarSource} active={false} />}
        content={
          <Text numberOfLines={1} ellipsizeMode="tail" style={styling.fullName}>
            {item.fullName}
          </Text>
        }
        action={action}
      />
    )
  }

  const renderExistedUser = ({ item }) => {
    const user = item.user
    const avatarSource = { uri: item.thumbnailPath ? item.thumbnailPath : user.photo.url64p }
    const navigateProfile = () => navigationActions.navigateProfile(navigation, { userId: user.userId })
    const isInvited = contactsInvite.invited[item.contactId]
    const isFollowed = user.followedStatus === 'FOLLOWING'
    const isRequested = contactsInvite.requested[item.contactId]

    const action =
      isInvited || isFollowed ? (
        <DefaultButton label={isFollowed ? t('Followed') : t('Invited')} mode="outlined" size="compact" disabled />
      ) : (
        <DefaultButton
          label={t('Follow')}
          onPress={() => contactsFollowRequest(item)}
          mode="outlined"
          size="compact"
          loading={isRequested}
          disabled={isRequested}
        />
      )

    return (
      <UserRowComponent
        avatar={
          <TouchableOpacity onPress={navigateProfile}>
            <Avatar thumbnailSource={avatarSource} imageSource={avatarSource} active={false} />
          </TouchableOpacity>
        }
        content={
          <TouchableOpacity onPress={navigateProfile}>
            <Text numberOfLines={1} ellipsizeMode="tail" style={styling.fullName}>
              {item.fullName}
            </Text>
            <Text numberOfLines={1} ellipsizeMode="tail" style={styling.username}>
              {user.username}
            </Text>
          </TouchableOpacity>
        }
        action={action}
      />
    )
  }

  const renderRow = ({ item }) => (
    <RowsItemComponent testID={testIDs.row} hasBorders>
      {item.user ? renderExistedUser({ item }) : renderInviteContact({ item })}
    </RowsItemComponent>
  )

  const renderEmpty = () => {
    return isSuccess ? (
      <Text style={styling.emptyText}>{t('We couldn\'t find any contacts on your device. Pull down to refresh.')}</Text>
    ) : null
  }

  const renderHeader = () => {
    const invitedCount = Object.keys(contactsInvite.invited).length

    return (
      <View style={styling.heading}>
        <View style={styling.headerIcon}>
          <ContactsIcon fill={theme.colors.text} />
        </View>

        {invitedCount >= inviteLimit ? (
          <>
            <Text style={styling.headingTitle}>{t('Connect Your Contacts')}</Text>
            <Text style={styling.headingSubtitle}>
              {t('Find people you know on REAL and choose who to follow or invite')}
            </Text>
          </>
        ) : (
          <>
            <Text style={styling.headingTitle}>{t('Get Diamond FREE for life')}</Text>
            <Text style={styling.headingSubtitle}>
              <Text style={styling.headingSubtitle}>
                {t('Follow or Invite {{leftInvite}} friends & ', {
                  leftInvite: inviteLimit - invitedCount,
                })}
              </Text>
              <Text style={styling.headingSubtitle}>{t('get ')}</Text>
              <Text style={styling.link} onPress={() => navigationActions.navigateMembership(navigation)}>
                {t('REAL Diamond')}
              </Text>
              {t(' FREE for life!')}
            </Text>
          </>
        )}

        <View style={styling.actions}>
          {contactsGet.status === 'failure' && (
            <>
              <DefaultButton style={styling.openSettingsBtn} label={t('Open Settings')} onPress={openSettings} />
              <Text style={styling.secondaryText}>{t('We never store your contacts anywhere')}</Text>
            </>
          )}
          {!['failure', 'success'].includes(contactsGet.status) && isEmpty && (
            <>
              <DefaultButton
                label={t('Check Contacts')}
                onPress={contactsGetRequest}
                loading={isLoading}
                disabled={isLoading}
              />
              <Text style={styling.secondaryText}>{t('We never store your contacts anywhere')}</Text>
            </>
          )}
        </View>
      </View>
    )
  }

  return (
    <SafeAreaView style={styling.root}>
      <FlatList
        contentContainerStyle={styling.list}
        ListHeaderComponent={renderHeader()}
        ListEmptyComponent={renderEmpty()}
        keyExtractor={(item) => item.contactId}
        refreshControl={refreshControl}
        data={contactsGet.items}
        renderItem={renderRow}
      />
    </SafeAreaView>
  )
}

InviteFriends.propTypes = {
  t: PropTypes.any,
  theme: PropTypes.any,
  navigation: PropTypes.any,
  contactsGetRequest: PropTypes.func,
  openSettings: PropTypes.func,
  contactsInviteRequest: PropTypes.func,
  contactsFollowRequest: PropTypes.func,
  contactsCheckBonusRequest: PropTypes.func,
  contactsGet: PropTypes.shape({
    status: PropTypes.string,
    items: PropTypes.arrayOf(
      PropTypes.shape({
        contactId: PropTypes.string,
        givenName: PropTypes.string,
        middleName: PropTypes.string,
        familyName: PropTypes.string,
        emails: PropTypes.arrayOf(PropTypes.string),
        phones: PropTypes.arrayOf(PropTypes.string),
      }),
    ),
  }),
  contactsInvite: PropTypes.shape({
    invited: PropTypes.any,
    requested: PropTypes.any,
  }),
}

const styles = (theme) =>
  StyleSheet.create({
    root: {
      flex: 1,
    },
    list: {
      paddingHorizontal: 12,
    },
    headerIcon: {
      alignItems: 'center',
      paddingBottom: 12,
    },
    heading: {
      paddingHorizontal: 48,
      paddingVertical: 24,
    },
    headingTitle: {
      fontSize: 22,
      fontWeight: '600',
      paddingBottom: 6,
      textAlign: 'center',
    },
    headingSubtitle: {
      fontSize: 18,
      fontWeight: '400',
      color: color(theme.colors.text).fade(0.4).string(),
      textAlign: 'center',
    },
    link: {
      fontSize: 18,
      fontWeight: '400',
      textDecorationLine: 'underline',
      color: theme.colors.primary,
    },
    emptyText: {
      fontSize: 14,
      fontWeight: '300',
      textAlign: 'center',
    },
    secondaryText: {
      marginTop: 7,
      fontSize: 14,
      fontWeight: '300',
      textAlign: 'center',
      color: theme.colors.placeholder,
    },
    actions: {
      paddingTop: 16,
    },
    openSettingsBtn: {
      marginTop: 12,
    },
    fullName: {
      paddingHorizontal: 8,
    },
    username: {
      color: color(theme.colors.text).fade(0.4).string(),
      paddingHorizontal: 8,
    },
  })

export default withTranslation()(withTheme(InviteFriends))
