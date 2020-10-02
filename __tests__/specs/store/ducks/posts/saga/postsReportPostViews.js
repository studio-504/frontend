import { range } from 'ramda'
import { groupActionsByType, packActions } from 'store/ducks/posts/saga/postsReportPostViews'
import * as actions from 'store/ducks/posts/actions'

describe('Post report post views', () => {
  describe('groupActionsByType', () => {
    it('empty array by default', () => {
      expect(groupActionsByType([])).toEqual([[], []])
    })

    it('no duplicates', () => {
      expect(
        groupActionsByType([
          actions.postsReportPostViewsRequest({ postIds: [1], viewType: 'THUMBNAIL' }),
          actions.postsReportPostViewsRequest({ postIds: [1], viewType: 'THUMBNAIL' }),
          actions.postsReportPostViewsRequest({ postIds: [2], viewType: 'FOCUS' }),
          actions.postsReportPostViewsRequest({ postIds: [2], viewType: 'FOCUS' }),
        ]),
      ).toEqual([[2], [1]])
    })

    it('grouped by type', () => {
      expect(
        groupActionsByType([
          actions.postsReportPostViewsRequest({ postIds: [1, 2, 3], viewType: 'THUMBNAIL' }),
          actions.postsReportPostViewsRequest({ postIds: [1, 4, 6], viewType: 'THUMBNAIL' }),
          actions.postsReportPostViewsRequest({ postIds: [1, 6, 5], viewType: 'FOCUS' }),
          actions.postsReportPostViewsRequest({ postIds: [2, 9, 2], viewType: 'FOCUS' }),
        ]),
      ).toEqual([
        [1, 6, 5, 2, 9],
        [1, 2, 3, 4, 6],
      ])
    })
  })

  it('packActions', () => {
    const postIds = range(0, 100)

    expect(packActions([postIds, postIds])).toEqual([
      { postIds: range(0, 50), viewType: 'FOCUS' },
      { postIds: range(50, 100), viewType: 'FOCUS' },
      { postIds: range(0, 50), viewType: 'THUMBNAIL' },
      { postIds: range(50, 100), viewType: 'THUMBNAIL' },
    ])
  })
})
