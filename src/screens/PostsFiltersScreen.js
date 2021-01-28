import React from 'react'
import PostsFiltersComponent from 'components/PostsFilters'
import PostsFiltersServiceComponent from 'components/PostsFilters/index.service'

class PostsFiltersScreen extends React.Component {
  render() {
    return (
      <PostsFiltersServiceComponent>
        {((props) => (
          <PostsFiltersComponent
            {...props}
          />
        ))}
      </PostsFiltersServiceComponent>
    )
  }
}

export default PostsFiltersScreen