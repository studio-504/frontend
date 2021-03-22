import React from 'react'
import PropTypes from 'prop-types'
import { FlatList } from 'react-native'
import PostsGridThumbnailComponent from 'components/PostsGrid/Thumbnail'

const Gallery = ({ posts }) => {
  if (posts.length === 0) {
    return null
  }

  return (
    <FlatList
      data={posts}
      numColumns={3}
      keyExtractor={(item) => item.postId}
      renderItem={({ item: post, index: priorityIndex }) => (
        <PostsGridThumbnailComponent
          post={post}
          priorityIndex={priorityIndex}
          thread="dating/profile"
          disabled
        />
      )}
    />
  )
}

Gallery.propTypes = {
  t: PropTypes.any,
  posts: PropTypes.array,
}

Gallery.defaultProps = {
  posts: [],
}

export default Gallery
