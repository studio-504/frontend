import React from 'react'
import PropTypes from 'prop-types'
import {
  StyleSheet,
  View,
  FlatList,
} from 'react-native'
import GridItemComponent from 'templates/GridItem'
import CacheComponent from 'components/Cache'
import TextOnlyComponent from 'templates/TextOnly/Thumbnail'
import path from 'ramda/src/path'
import * as navigationActions from 'navigation/actions'
import BellIcon from 'assets/svg/action/Bell'

import { withTheme } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'

const PostsGrid = ({
  theme,
  postsGet,
  thread,
  listProps,
}) => {
  const styling = styles(theme)
  const navigation = useNavigation()

  const activeIcon = (
    <View style={{ padding: theme.spacing.base }}><BellIcon fill="red" /></View>
  )

  const hideProgress = ['posts/trending'].includes(thread)

  return (
    <View style={styling.root}>
      <FlatList
        {...listProps}
        data={path(['data'])(postsGet)}
        numColumns={3}
        keyExtractor={item => item.postId}
        renderItem={({ item: post, index: priorityIndex }) => (
          <GridItemComponent
            onPress={navigationActions.navigatePostMedia(navigation, { postId: post.postId, userId: post.postedBy.userId })}
            active={path(['commentsUnviewedCount'])(post) > 0}
            activeIcon={activeIcon}
            inactiveIcon={null}
          >
            {post.postType === 'IMAGE' ?
              <CacheComponent
                thread={thread}
                images={[
                  [path(['image', 'url480p'])(post), true],
                ]}
                fallback={path(['image', 'url480p'])(post)}
                priorityIndex={priorityIndex}
                resizeMode="cover"
                hideProgress={hideProgress}
              />
            : null}

            {post.postType === 'TEXT_ONLY' ?
              <TextOnlyComponent
                text={post.text}
              />
            : null}
          </GridItemComponent>
        )}
      />
    </View>
  )
}
const styles = theme => StyleSheet.create({
  root: {
    backgroundColor: theme.colors.backgroundPrimary,
    height: '100%',
  },
})

PostsGrid.defaultProps = {
  postsGet: {},
}

PostsGrid.propTypes = {
  theme: PropTypes.any,
  postsGet: PropTypes.any,
  thread: PropTypes.any,
  listProps: PropTypes.any,
}

export default withTheme(PostsGrid)
