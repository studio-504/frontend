import React, { useEffect, useRef, useState, memo } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import PropTypes from 'prop-types'
import Video from 'react-native-video'
import videoAccessCookie from 'services/helpers/videoAccessCookie'


const VideoPlayer = ({ post, postInView }) => {
  const player = useRef()
  const [isPlaying, setPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [progress, setProgress] = useState(0)

  const isInView = post.postId === postInView

  const onVideoLoad = ({ duration }) => {
    setDuration(duration)
  }

  const onProgress = ({ currentTime }) => {
    setProgress(currentTime)
  }

  const timeLeft = (seconds) => {
    return new Date(seconds * 1000).toISOString().substr(15, 4)
  }

  const setAccessCookies = async () => {
    const { domain, keyPairId, policy, signature, expiresAt } = post.video.accessCookies
    await videoAccessCookie(domain, keyPairId, policy, signature, expiresAt)
    setPlaying(isInView)
  }

  useEffect(() => {
    if (isInView)
      setAccessCookies()

    if (!isInView && isPlaying)
      setPlaying(false)
  }, [postInView])

  if (post.postId === 'c5712226-9d35-4aec-93b2-79898b00c32a')
    console.log('re -render', post.postId, postInView )

  return (
    <View style={styles.playerContainer}>
      {isInView && (
        <Text style={styles.progress}>{timeLeft(duration - ~~progress)}</Text>
      )}
      <Video
        ref={player}
        poster={post.image.url}
        // source={!isPlaying ? null : { uri: post.video.urlMasterM3U8 }}
        source={{ uri: post.video.urlMasterM3U8 }}
        paused={!isPlaying}
        style={styles.videoStyle}
        resizeMode="cover"
        repeat
        onLoad={onVideoLoad}
        onProgress={onProgress}
        progressUpdateInterval={1000}
        onError={(error) => console.log(error)}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  playerContainer: {
    position: 'relative',
  },
  videoStyle: {
    width: '100%',
    height: undefined,
    aspectRatio: 1,
  },
  progress: {
    color: '#fff',
    fontSize: 12,
    position: 'absolute',
    top: 10,
    right: 10,
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
