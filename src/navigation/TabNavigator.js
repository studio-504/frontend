/* eslint-disable react/prop-types */
import React, { useContext, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { TouchableOpacity } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import { ThemeContext } from 'services/providers/Theme'
import { AuthContext } from 'services/providers/Auth'
import SearchFeedContext from 'components/Search/Context'
import * as navigationOptions from 'navigation/options'
import * as navigationActions from 'navigation/actions'
import * as postsActions from 'store/ducks/posts/actions'
import * as UserService from 'services/User'

import FeedNavigator from 'navigation/Feed'
import SearchNavigator from 'navigation/Search'
import DatingNavigator from 'navigation/Dating'
import ProfileNavigator from 'navigation/Profile'

import HomeIcon from 'assets/svg/footer/Home'
import SearchIcon from 'assets/svg/footer/Search'
import CreateIcon from 'assets/svg/footer/Create'
import DatingIcon from 'assets/svg/footer/Dating'
import UserIcon from 'assets/svg/footer/User'
import testIDs from './test-ids'

const Tab = createBottomTabNavigator()

const TabNavigator = ({ navigation, route }) => {
  const { theme } = useContext(ThemeContext)
  const { user } = useContext(AuthContext)

  const tabNavigatorProps = navigationOptions.tabNavigatorProps({ theme, route })

  const renderIcon = (Icon) => ({ color }) => <Icon fill={color} />

  const SearchTabButtonComponent = (props) => {
    const dispatch = useDispatch()
    const searchFeedContext = useContext(SearchFeedContext)

    const handleSearchPress = (props) => () => {
      searchFeedContext.handleFormFocus(false)
      props.onPress()

      setTimeout(() => {
        dispatch(postsActions.postsGetTrendingPostsRequest())
      }, 350)
    }

    return <TouchableOpacity {...props} onPress={handleSearchPress(props)} />
  }

  const CameraTabButtonComponent = (props) => (
    <TouchableOpacity
      {...props}
      onPress={navigationActions.navigatePostType(navigation, { actionType: 'HOME' }, { protected: true, user })}
    />
  )

  const DatingTabButtonComponent = (props) => (
    <TouchableOpacity
      {...props}
      onPress={navigationActions.navigateDating(navigation, {}, { protected: true, user })}
    />
  )

  const PostType = () => null

  const OPTIONS = {
    FEED: {
      tabBarLabel: 'Home',
      tabBarIcon: renderIcon(HomeIcon),
    },
    SEARCH: {
      tabBarLabel: 'Explore',
      tabBarIcon: renderIcon(SearchIcon),
      tabBarButton: SearchTabButtonComponent,
    },
    POST_TYPE: {
      tabBarLabel: 'Create',
      tabBarIcon: renderIcon(CreateIcon),
      tabBarButton: CameraTabButtonComponent,
    },
    DATING: {
      tabBarLabel: 'Dating',
      tabBarIcon: renderIcon(DatingIcon),
      tabBarButton: DatingTabButtonComponent,
    },
    PROFILE: {
      tabBarLabel: 'Profile',
      tabBarIcon: renderIcon(UserIcon),
      tabBarTestID: testIDs.tabNavigator.profile,
    },
  }

  /*
   * We use listen tabPress for save scroll to scrollView top on tabPress
   * https://reactnavigation.org/docs/bottom-tab-navigator/#tabpress
   */
  const privateRoute = useCallback(
    ({ navigation }) => ({
      tabPress: (e) => {
        if (!UserService.isUserActive(user)) {
          e.preventDefault()
          navigationActions.navigateProfileUpgrade(navigation)
        }
      },
    }),
    [user],
  )

  return (
    <Tab.Navigator {...tabNavigatorProps} initialRouteName="Feed">
      <Tab.Screen name="Feed" component={FeedNavigator} options={OPTIONS.FEED} />
      <Tab.Screen name="Search" component={SearchNavigator} options={OPTIONS.SEARCH} />
      <Tab.Screen name="PostType" component={PostType} options={OPTIONS.POST_TYPE} />
      <Tab.Screen name="Dating" component={DatingNavigator} options={OPTIONS.DATING} />
      <Tab.Screen name="Profile" component={ProfileNavigator} options={OPTIONS.PROFILE} listeners={privateRoute} />
    </Tab.Navigator>
  )
}

export default TabNavigator
