import React, { useEffect, useRef, useState, memo } from 'react'
import { View, Text, StyleSheet, TouchableWithoutFeedback } from 'react-native'
import PropTypes from 'prop-types'
import Video from 'react-native-video'
import SoundIcon from 'assets/svg/player/Sound'
import NoSoundIcon from 'assets/svg/player/NoSound'

const VideoPlayer = ({ post, postInView }) => {
  const player = useRef()
  const soundTimeout = useRef()
  const [isPlaying, setPlaying] = useState(false)
  const [muted, setMuted] = useState(true)
  const [soundVisible, setSoundVisible] = useState(false)
  const [duration, setDuration] = useState(0)
  const [progress, setProgress] = useState(0)
  const [videoSize, setVideoSize] = useState({
    width: 1,
    height: 1,
  })

  const isInView = post.postId === postInView

  const onVideoLoad = ({ duration, naturalSize }) => {
    console.log(post.image)
    setVideoSize(naturalSize)
    setDuration(duration)
  }

  const onProgress = ({ currentTime }) => {
    setProgress(currentTime)
  }

  const timeLeft = (seconds) => {
    return new Date(seconds * 1000).toISOString().substr(15, 4)
  }

  const toggleMuted = () => setMuted(isMuted => !isMuted)

  useEffect(() => {
    if (isInView)
      setPlaying(isInView)

    if (!isInView && isPlaying)
      setPlaying(false)
  }, [postInView])

  useEffect(() => {
    if (soundTimeout.current)
      clearTimeout(soundTimeout.current)
    setSoundVisible(true)
    soundTimeout.current = setTimeout(() => {
      setSoundVisible(false)
    }, 3000)
  }, [muted])

  return (
    <TouchableWithoutFeedback onPress={toggleMuted}>
      <View style={styles.playerContainer}>
        {isInView && (
          <Text style={styles.progress}>{timeLeft(duration - ~~progress)}</Text>
        )}
        {soundVisible && (
          <View style={styles.volume}>
            {muted ? <NoSoundIcon fill="#fff" size={16} /> : <SoundIcon fill="#fff" size={16} />}
          </View>
        )}
        <Video
          ref={player}
          poster={post.image.url}
          source={{
            uri: post.video.urlMasterM3U8,
            headers: {
              Cookie: `CloudFront-Key-Pair-Id=${post.video.accessCookies.keyPairId}; CloudFront-Policy=${post.video.accessCookies.policy}; CloudFront-Signature=${post.video.accessCookies.signature}`,
            },
          }}
          style={styles.videoStyle(videoSize.width, videoSize.height)}
          paused={!isPlaying}
          muted={muted}
          resizeMode="contain"
          repeat
          onLoad={onVideoLoad}
          onProgress={onProgress}
          progressUpdateInterval={1000}
          onError={(error) => console.log(error)}
        />
      </View>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  playerContainer: {
    position: 'relative',
  },
  videoStyle: (width = 1, height = 1) => ({
    width: '100%',
    height: undefined,
    aspectRatio: width / height,
  }),
  progress: {
    color: '#fff',
    fontSize: 12,
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 2,
  },
  volume: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    zIndex: 2,
  },
})

VideoPlayer.propTypes = {
  post: PropTypes.any,
  postInView: PropTypes.string,
}

const arePropsEqual = (prev, next) => {
  return prev.postInView === next.postInView
}

export default memo(VideoPlayer, arePropsEqual)
