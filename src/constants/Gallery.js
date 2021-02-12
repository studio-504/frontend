import Layout from 'constants/Layout'

const SCREENS_BUFFER = 3
const MAX_LIMIT = 100

const { width, height } = Layout.window

function calulateFetchLimit(itemsOnScreen) {
  const value = SCREENS_BUFFER * itemsOnScreen

  return value > MAX_LIMIT ? MAX_LIMIT : value
}

function calculateLayout({ numColumns }) {
  const itemSize = width / numColumns
  const rowsOnScreen = Math.round(height / itemSize)
  const itemsOnScreen = numColumns * rowsOnScreen
  const fetchLimit = calulateFetchLimit(itemsOnScreen)
  const maxToRenderPerBatch = Math.round(itemsOnScreen / 2)
  const initialNumToRender = itemsOnScreen
  const onEndReachedThreshold = 2

  return {
    numColumns,
    itemSize,
    rowsOnScreen,
    itemsOnScreen,
    fetchLimit,
    maxToRenderPerBatch,
    initialNumToRender,
    onEndReachedThreshold,
  }
}

export const TRENDING_GALLERY = calculateLayout({ numColumns: 3 })
