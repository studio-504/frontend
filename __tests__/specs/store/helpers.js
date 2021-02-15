import * as ErrorsService from 'services/Errors'

describe('Store helpers', () => {
  describe('errorWrapper', () => {
    it('handle native error', () => {
      const error = new Error('Error')
      expect(ErrorsService.errorWrapper(error)).toBe(error.message)
      expect(ErrorsService.errorWrapper(new Error(''))).toBeUndefined()
    })

    it('handle graphql api errors', () => {
      const errors = ['1', '2']
      const graphqlError = { errors }

      expect(ErrorsService.errorWrapper(graphqlError)).toBe(errors)
    })
  })
})
