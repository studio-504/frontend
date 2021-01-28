import React, { useRef, useState } from 'react'
import PropTypes from 'prop-types'

const SCROLL_ANIMATION_SPEED = 350
const SearchFeedContext = React.createContext(null)

export const SearchFeedProvider = ({ children }) => {
  const feedRef = useRef(null)
  const [formFocus, handleFormFocus] = useState(false)

  const scrollToTop = () =>
    new Promise((resolve) => {
      try {
        feedRef.current.scrollToOffset({ animated: true, offset: 0 })
      } catch (error) {
        // ignore
      } finally {
        setTimeout(resolve, SCROLL_ANIMATION_SPEED)
      }
    })

  return (
    <SearchFeedContext.Provider value={{ feedRef, scrollToTop, formFocus, handleFormFocus }}>
      {children}
    </SearchFeedContext.Provider>
  )
}

SearchFeedProvider.propTypes = {
  children: PropTypes.any,
}

export default SearchFeedContext
