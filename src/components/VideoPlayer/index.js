import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import PropTypes from 'prop-types'
import Video from 'react-native-video'
import videoAccessCookie from 'services/helpers/videoAccessCookie'
import { v4 as uuid } from 'uuid'

const VideoPlayer = ({ post, postInView }) => {
  const [isPlaying, setPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [progress, setProgress] = useState(0)

  const [key, setKey] = useState(uuid())
  useEffect(() => {
    const isInView = post.postId === postInView
    if (isInView)
    {
      const { domain, keyPairId, policy, signature, expiresAt } = post.video.accessCookies
      videoAccessCookie(domain, keyPairId, policy, signature, expiresAt)
      setKey(uuid())
    }
    setPlaying(isInView)
  }, [postInView])

  const onVideoLoad = ({ duration }) => {
    setDuration(duration)
  }

  const onProgress = ({ currentTime }) => {
    setProgress(duration - ~~currentTime)
  }

  const timeLeft = (seconds) => {
    return new Date(seconds * 1000).toISOString().substr(15, 4)
  }

  return (
    <View style={styles.playerContainer}>
      {progress > 0 && (
        <Text style={styles.progress}>{timeLeft(progress)}</Text>
      )}
      <Video
        key={key}
        poster={post.image.url}
        source={{
          uri: post.video.urlMasterM3U8,
        }}
        paused={!isPlaying}
        style={styles.videoStyle}
        resizeMode="cover"
        repeat
        onLoad={onVideoLoad}
        onProgress={onProgress}
        progressUpdateInterval={1000}
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

export default VideoPlayer
