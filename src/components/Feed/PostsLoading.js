import React from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, View } from 'react-native'
import GridComponent from 'templates/Grid'
import GridItemComponent from 'templates/GridItem'
import * as Animatable from 'react-native-animatable'
import { withTheme } from 'react-native-paper'

const fadeInOut = {
  from: {
    opacity: 0.8,
  },
  to: {
    opacity: 0.4,
  },
}

const PostsGrid = ({ theme }) => {
  const styling = styles(theme)

  return (
    <Animatable.View
      animation={fadeInOut}
      duration={1200}
      easing="ease-in-out"
      iterationCount="infinite"
      direction="alternate-reverse"
      style={styling.root}
      useNativeDriver
    >
      <GridComponent items={[{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}]}>
        {() => (
          <GridItemComponent>
            <View style={styling.item} />
          </GridItemComponent>
        )}
      </GridComponent>
    </Animatable.View>
  )
}
const styles = (theme) =>
  StyleSheet.create({
    root: {
      flex: 1,
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    item: {
      width: '100%',
      height: '100%',
      backgroundColor: theme.colors.disabled,
      opacity: 0.8,
    },
  })

PostsGrid.propTypes = {
  theme: PropTypes.any,
}

export default withTheme(PostsGrid)
