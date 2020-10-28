import { useState, useEffect } from 'react'
import { PERMISSIONS, RESULTS, check, request } from 'react-native-permissions'
import useAppState from 'services/AppState'
import { openSettings } from 'react-native-permissions'
import { useNavigation, useFocusEffect } from '@react-navigation/native'

const Permissions = ({ children, camera, library, location }) => {
  const navigation = useNavigation()

  /**
   * Ui state
   */
  const [isModalOpen, setIsModalOpen] = useState(false)
  useFocusEffect(() => {
    setIsModalOpen(true)
  })

  const handleClose = () => {
    navigation.goBack()
    setIsModalOpen(false)
  }

  /**
   * Permissions state
   */  
  const [cameraEnabled, setCameraEnabled] = useState(true)
  const [libraryEnabled, setLibraryEnabled] = useState(true)
  const [locationEnabled, setLocationEnabled] = useState(true)

  const checkCamera = async () => {
    const result = await check(PERMISSIONS.IOS.CAMERA)
    setCameraEnabled(result !== RESULTS.BLOCKED)
  }

  const checkLibrary = async () => {
    const result = await check(PERMISSIONS.IOS.PHOTO_LIBRARY)
    setLibraryEnabled(result !== RESULTS.BLOCKED)
  }

  const checkLocation = async () => {
    const result = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE)
    setLocationEnabled(result !== RESULTS.BLOCKED)
  }

  const requestCamera = async () => {
    const result = await check(PERMISSIONS.IOS.CAMERA)

    if (result === RESULTS.DENIED) {
      return request(PERMISSIONS.IOS.CAMERA)
    }
  }

  const requestLibrary = async () => {
    const result = await check(PERMISSIONS.IOS.PHOTO_LIBRARY)

    if (result === RESULTS.DENIED) {
      return request(PERMISSIONS.IOS.PHOTO_LIBRARY)
    }
  }

  const requestLocation = async () => {
    const result = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE)

    if (result === RESULTS.DENIED) {
      return request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE)
    }
  }

  const getPermissions = async () => {
    if (camera) {
      await requestCamera()
      await checkCamera()
    }

    if (library) {
      await requestLibrary()
      await checkLibrary()
    }


    if (location) {
      await requestLocation()
      await checkLocation()
    }
  }

  useAppState({
    onForeground: () => {
      getPermissions()
    },
  })

  useEffect(() => {
    getPermissions()
  }, [])

  return children({
    handleClose,
    isModalOpen,
    cameraEnabled,
    libraryEnabled,
    locationEnabled,

    checkCamera,
    requestCamera,
    checkLibrary,
    requestLibrary,
    checkLocation,
    requestLocation,
    openSettings,
  })
}

export default Permissions