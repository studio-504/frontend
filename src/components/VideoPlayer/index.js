import React, { memo } from 'react'
import { View, Text, StyleSheet, TouchableWithoutFeedback } from 'react-native'
import PropTypes from 'prop-types'
import Video from 'react-native-video'
import VideoPlayerService from 'components/VideoPlayer/index.service'
import SoundIcon from 'assets/svg/player/Sound'
import NoSoundIcon from 'assets/svg/player/NoSound'

const VideoPlayer = ({ post, postInView, autoPlay }) => (
  <VideoPlayerService
    postId={post.postId}
    postInView={postInView}
    autoPlay={autoPlay}
  >
    {({
      toggleSound,
      isInView,
      soundVisible,
      isPlaying,
      onVideoLoad,
      onProgress,
      isMuted,
      timeLeft,
    }) => (
      <TouchableWithoutFeedback onPress={toggleSound}>
        <View style={styles.playerContainer}>
          {isInView ? (
            <Text style={styles.progress}>{timeLeft}</Text>
          ) : null}
          {soundVisible ? (
            <View style={styles.volume}>
              {isMuted ? <NoSoundIcon fill="#fff" size={16} /> : <SoundIcon fill="#fff" size={16} />}
            </View>
          ) : null}
          <Video
            poster={post.image.url}
            source={{
              uri: post.video.urlMasterM3U8,
              headers: {
                Cookie: `CloudFront-Key-Pair-Id=${post.video.accessCookies.keyPairId}; CloudFront-Policy=${post.video.accessCookies.policy}; CloudFront-Signature=${post.video.accessCookies.signature}`,
              },
            }}
            style={styles.videoStyle(post.video.resolutions[0].width, post.video.resolutions[0].height)}
            paused={!isPlaying}
            muted={isMuted}
            resizeMode="cover"
            repeat
            onLoad={onVideoLoad}
            onProgress={onProgress}
            progressUpdateInterval={1000}
          />
        </View>
      </TouchableWithoutFeedback>
    )}
  </VideoPlayerService>
)

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
  autoPlay: PropTypes.bool,
}

const arePropsEqual = (prev, next) => {
  return prev.postInView === next.postInView
}

export default memo(VideoPlayer, arePropsEqual)
