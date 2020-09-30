import React from 'react'
import PropTypes from 'prop-types'
import color from 'color'
import { View, ScrollView, SafeAreaView, StyleSheet } from 'react-native'
import { Text } from 'react-native-paper'
import { withTranslation } from 'react-i18next'
import { withTheme } from 'react-native-paper'
import ContactsIcon from 'assets/svg/contacts/Contacts'
import DefaultButton from 'components/Formik/Button/DefaultButton'
import RowsComponent from 'templates/Rows'

const InviteFriends = ({ t, theme, contactsGet, contactsGetRequest, openSettings }) => {
  const styling = styles(theme)
  const isLoading = contactsGet.status === 'loading'

  return (
    <ScrollView style={styling.root}>
      <SafeAreaView style={styling.component}>
        <View style={styling.heading}>
          <View style={styling.headerIcon}>
            <ContactsIcon fill={theme.colors.text} />
          </View>
          <Text style={styling.headingTitle}>{t('Connect Your Contacts')}</Text>
          <Text style={styling.headingSubtitle}>{t('Find people you know on Real.app and choose who to follow.')}</Text>
        </View>
        <View style={styling.content}>
          <View style={styling.actions}>
            {contactsGet.error ? <Text style={styling.errorText}>{contactsGet.error}</Text> : null}
            {contactsGet.status === 'failure' && (
              <DefaultButton style={styling.openSettingsBtn} label={t('Open the "Settings"')} onPress={openSettings} />
            )}
            {!['failure', 'success'].includes(contactsGet.status) && (
              <DefaultButton
                label={t('Connect Contacts')}
                onPress={contactsGetRequest}
                loading={isLoading}
                disabled={isLoading}
              />
            )}
          </View>
          {contactsGet.status === 'success' && (
            <RowsComponent items={contactsGet.items}>
              {(user) => (
                <View>
                  <Text>{user.givenName}</Text>
                </View>
              )}
            </RowsComponent>
          )}
        </View>
      </SafeAreaView>
    </ScrollView>
  )
}

InviteFriends.propTypes = {
  t: PropTypes.any,
  theme: PropTypes.any,
  contactsGetRequest: PropTypes.func,
  openSettings: PropTypes.func,
  contactsGet: PropTypes.shape({
    status: PropTypes.string,
    error: PropTypes.string,
    items: PropTypes.array,
  }),
}

const styles = (theme) =>
  StyleSheet.create({
    root: {
      flex: 1,
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
      fontSize: 16,
      fontWeight: '400',
      color: color(theme.colors.text).fade(0.4),
      textAlign: 'center',
    },
    errorText: {
      fontSize: 14,
      fontWeight: '300',
      paddingBottom: 6,
      textAlign: 'center',
      color: 'red',
    },
    content: {
      paddingHorizontal: 16,
    },
    openSettingsBtn: {
      marginTop: 12,
    },
  })

export default withTranslation()(withTheme(InviteFriends))
