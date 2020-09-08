import React from 'react'
import PropTypes from 'prop-types'
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import { Text } from 'react-native-paper'

import { withTheme } from 'react-native-paper'

const Filter = ({
  theme,
  trendingFilters: {
    viewedStatus,
    verifiedStatus,
    handlePostsAllFilter,
    handlePostsViewedFilter,
    handlePostsNotViewedFilter,
    handlePostsVerifiedFilter,
    handlePostsNotVerifiedFilter,
  },
}) => {
  const styling = styles(theme)

  const filters = [
    { title: 'All', isActive: viewedStatus === undefined && verifiedStatus === undefined, onPress: handlePostsAllFilter },
    { title: 'Verified', isActive: verifiedStatus === true, onPress: handlePostsVerifiedFilter },
    { title: 'Not Verified', isActive: verifiedStatus === false, onPress: handlePostsNotVerifiedFilter },
    { title: 'Viewed', isActive: viewedStatus === 'VIEWED', onPress: handlePostsViewedFilter },
    { title: 'Not Viewed', isActive: viewedStatus === 'NOT_VIEWED', onPress: handlePostsNotViewedFilter },
  ]

  return (
    <View style={styling.root}>
      <ScrollView style={styling.filters} horizontal>
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter.title}
            style={filter.isActive ? [styling.filter, styling.filterSelected] : [styling.filter, styling.filterCreate]}
            onPress={filter.onPress}
          >
            <Text style={styling.text}>{filter.title}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  )
}

const styles = (theme) =>
  StyleSheet.create({
    root: {},
    filters: {
      flexWrap: 'wrap',
      flexDirection: 'row',
    },
    filter: {
      borderRadius: 4,
      marginRight: theme.spacing.base,
      marginBottom: 6,
      padding: 6,
    },
    filterCreate: {
      borderColor: theme.colors.border,
      borderWidth: 1,
    },
    filterSelected: {
      backgroundColor: theme.colors.primary,
    },
    text: {
      fontWeight: '500',
    },
  })

Filter.propTypes = {
  theme: PropTypes.any,
  t: PropTypes.any,
  trendingFilters: PropTypes.shape({
    viewedStatus: PropTypes.oneOf(['VIEWED', 'NOT_VIEWED']),
    verifiedStatus: PropTypes.bool,
    handlePostsAllFilter: PropTypes.func,
    handlePostsViewedFilter: PropTypes.func,
    handlePostsNotViewedFilter: PropTypes.func,
    handlePostsVerifiedFilter: PropTypes.func,
    handlePostsNotVerifiedFilter: PropTypes.func,
  }),
}

Filter.defaultProps = {
  values: {},
}

export default withTheme(Filter)
