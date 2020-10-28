import useProfilePhoto from 'services/providers/ProfilePhoto'

const UploadAvatarService = ({ children }) => children(useProfilePhoto())

export default UploadAvatarService
