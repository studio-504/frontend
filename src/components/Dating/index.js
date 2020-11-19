import React, { useRef, useCallback } from 'react'
import PropTypes from 'prop-types'
import {
  StyleSheet,
  View,
  ScrollView,
  RefreshControl,
} from 'react-native'
import DatingCard from 'components/Dating/Card'
import DatingActions from 'components/Dating/Actions'
import DatingPlaceholder from 'components/Dating/Placeholder'
import Swiper from 'react-native-deck-swiper'
import path from 'ramda/src/path'
import pathOr from 'ramda/src/pathOr'

import { withTheme } from 'react-native-paper'
import { withTranslation } from 'react-i18next'

const getUserPosts = pathOr([], ['posts', 'items'])

const Dating = ({
  theme,
  datingMatchedUsersRequest,
  datingMatchedUsersIdle,
  datingMatchedUsers,
  handleSwipedLeft,
  handleSwipedRight,
}) => {
  const styling = styles(theme)
  const swiperRef = useRef(null)
  const renderCard = useCallback((datingUser) => <DatingCard user={datingUser} posts={getUserPosts(datingUser)} />, [])

  const loadingVisibility = path(['status'], datingMatchedUsers) === 'loading'
  const matchesVisibility = path(['data', 'length'], datingMatchedUsers)

  return (
    <ScrollView
      contentContainerStyle={styling.root}
      refreshControl={
        <RefreshControl
          tintColor={theme.colors.border}
          refreshing={loadingVisibility}
          onRefresh={datingMatchedUsersRequest}
        />
      }
    > 
      {matchesVisibility ?
        <React.Fragment>
          <View style={styling.carousel}>
            <Swiper
              ref={swiperRef}
              cards={datingMatchedUsers.data}
              onSwipedLeft={handleSwipedLeft}
              onSwipedRight={handleSwipedRight}
              onSwipedAll={datingMatchedUsersIdle}
              renderCard={renderCard}
              cardIndex={0}
              stackSize={3}
              verticalSwipe={false}
              cardVerticalMargin={theme.spacing.base}
              cardHorizontalMargin={theme.spacing.base}
              backgroundColor={theme.colors.backgroundPrimary}
              cardStyle={styling.card}
            />
          </View>
          <View style={styling.actions}>
            <DatingActions swiperRef={swiperRef} />
          </View>
        </React.Fragment>
      : <DatingPlaceholder
          datingMatchedUsersRequest={datingMatchedUsersRequest}
        />
      }    
    </ScrollView>
  )
}

const styles = theme => StyleSheet.create({
  root: {
    flex: 1,
  },
  carousel: {
    flex: 1,
  },
  actions: {
    height: 120,
    marginTop: theme.spacing.base,
  },
  card: {
    height: '100%',
  },
})

Dating.propTypes = {
  theme: PropTypes.any,
  datingMatchedUsersRequest: PropTypes.func,
  datingMatchedUsersIdle: PropTypes.func,
  datingMatchedUsers: PropTypes.any,
  handleSwipedLeft: PropTypes.func,
  handleSwipedRight: PropTypes.func,
}

export default withTranslation()(withTheme(Dating))
