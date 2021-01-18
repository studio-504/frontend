import React, { useContext, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'
import * as usersActions from 'store/ducks/users/actions'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import DatingAboutScreen from 'screens/DatingAboutScreen'
import DatingMatchScreen from 'screens/DatingMatchScreen'
import DatingProfileScreen from 'screens/DatingProfileScreen'
import DatingAvatarScreen from 'screens/DatingAvatarScreen'
import * as navigationOptions from 'navigation/options'
import { ThemeContext } from 'services/providers/Theme'
import ProgressTabBar from 'components/DatingWizard/ProgressTabBar'

const STEPS = {
  AVATAR: 'DatingAvatar',
  PROFILE: 'DatingAbout',
  MATCH: 'DatingMatch',
  PREVIEW: 'DatingProfile',
}

const getNextStep = (step) => {
  const keys = Object.values(STEPS)

  return keys[keys.indexOf(step) + 1]
}

const Tab = createMaterialTopTabNavigator()

const DatingWizardNavigator = ({ navigation }) => {
  const dispatch = useDispatch()
  const [step, setStep] = useState(STEPS.AVATAR)
  const usersEditProfile = useSelector((state) => state.users.usersEditProfile)
  const { theme } = useContext(ThemeContext)
  const tabNavigatorDatingWizardProps = navigationOptions.tabNavigatorDatingWizardProps({ theme })

  const handleNext = () => handleStepChange(getNextStep(step))

  const handleStepChange = (step) => {
    navigation.jumpTo(step, { nextAction: true })
    setStep(step)
  }

  useEffect(() => {
    if (usersEditProfile.status === 'success' && step !== STEPS.AVATAR) {
      dispatch(usersActions.usersEditProfileIdle())
      handleNext()
    }
  }, [usersEditProfile.status])

  return (
    <Tab.Navigator
      tabBar={(props) => <ProgressTabBar onChange={handleStepChange} {...props} />}
      {...tabNavigatorDatingWizardProps}
      initialRouteName={STEPS.AVATAR}
      backBehavior="order"
      swipeEnabled={false}
    >
      <Tab.Screen
        name={STEPS.AVATAR}
        options={{
          tabBarLabel: 'Photo',
        }}
      >
        {(props) => <DatingAvatarScreen {...props} handleNext={handleNext} />}
      </Tab.Screen>
      <Tab.Screen
        name={STEPS.PROFILE}
        component={DatingAboutScreen}
        options={{
          tabBarLabel: 'Profile',
        }}
      />
      <Tab.Screen
        name={STEPS.MATCH}
        component={DatingMatchScreen}
        options={{
          tabBarLabel: 'Match',
        }}
      />
      <Tab.Screen
        name={STEPS.PREVIEW}
        component={DatingProfileScreen}
        options={{
          tabBarLabel: 'Preview',
        }}
      />
    </Tab.Navigator>
  )
}

DatingWizardNavigator.propTypes = {
  navigation: PropTypes.any,
}

export default DatingWizardNavigator
