import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import secondsToDuration from 'services/helpers/secondsToDuration'
import * as playerActions from 'store/ducks/player/actions'
import * as playerSelectors from 'store/ducks/player/selectors'

const VideoPlayerService = ({ postId, postInView, children }) => {
  const dispatch = useDispatch()
  const playerState = useSelector(playerSelectors.getState)
  const soundTimeout = useRef()
  const [isPlaying, setPlaying] = useState(false)
  const [soundVisible, setSoundVisible] = useState(false)
  const [duration, setDuration] = useState(0)
  const [progress, setProgress] = useState(0)

  const isInView = postId === postInView

  const onVideoLoad = ({ duration }) => {
    setDuration(duration)
  }

  const onProgress = ({ currentTime }) => {
    setProgress(currentTime)
  }

  const toggleSound = () => dispatch(playerActions.toggleSound())

  const timeLeft = secondsToDuration(duration - Math.trunc(progress))

  useEffect(() => {
    if (isInView) {
      setPlaying(isInView)
    }

    if (!isInView && isPlaying) {
      setPlaying(false)
    }

    console.log(isInView)
  }, [postInView])

  useEffect(() => {
    if (soundTimeout.current) {
      clearTimeout(soundTimeout.current)
    }

    setSoundVisible(true)
    soundTimeout.current = setTimeout(() => {
      setSoundVisible(false)
    }, 3000)
  }, [playerState.muted])

  useEffect(() => {
    if (postInView === undefined)
      setPlaying(true)
  }, [])

  return children({
    toggleSound,
    isInView,
    soundVisible,
    isPlaying,
    onVideoLoad,
    onProgress,
    timeLeft,
    isMuted: playerState.muted,
  })
}

export default VideoPlayerService
