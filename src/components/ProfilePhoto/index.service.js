import useProfilePhoto from 'services/providers/ProfilePhoto'

const ProfilePhotoService = ({ children }) => children(useProfilePhoto({ backRoute: 'ProfileSelf' }))

export default ProfilePhotoService
 