import { expectSaga } from 'redux-saga-test-plan'
import { testEntitiesMerge, testAsRootSaga } from 'tests/utils/helpers'
import chat from 'store/ducks/chat/saga'
import * as queries from 'store/ducks/chat/queries'
import * as chatActions from 'store/ducks/chat/actions'
import * as queryService from 'services/Query'

jest.mock('services/Query', () => ({ apiRequest: jest.fn().mockResolvedValue(true) }))

const saga = () => expectSaga(testAsRootSaga(chat))

describe('Chat sagas', () => {
  afterEach(() => {
    queryService.apiRequest.mockClear()
  })

  describe('chatGetChatsRequest', () => {
    it('success', async () => {
      const payload = { userId: 'id123' }
      const response = { data: { self: { chats: { items: [{ chatId: 1 }] } } } }
      const entities = { chats: { 1: { chatId: 1 } } }

      queryService.apiRequest.mockResolvedValueOnce(response)

      await testEntitiesMerge(saga(), entities)
        .put(chatActions.chatGetChatsSuccess({ data: [1], payload, meta: {} }))

        .dispatch(chatActions.chatGetChatsRequest(payload))
        .silentRun()

      expect(queryService.apiRequest).toHaveBeenCalledWith(queries.chats, payload)
    })
  })

  describe('chatGetChatRequest', () => {
    it('success', async () => {
      const payload = { userId: 'id123' }
      const response = { data: { chat: { chatId: 1 } } }
      const entities = { chats: { 1: { chatId: 1 } } }

      queryService.apiRequest.mockResolvedValueOnce(response)

      await testEntitiesMerge(saga(), entities)
        .put(chatActions.chatGetChatSuccess({ data: 1, payload, meta: {} }))

        .dispatch(chatActions.chatGetChatRequest(payload))
        .silentRun()

      expect(queryService.apiRequest).toHaveBeenCalledWith(queries.chat, payload)
    })
  })

  describe('chatCreateDirectRequest', () => {
    it('success', async () => {
      const payload = { userId: 'id123' }
      const response = { data: { createDirectChat: { chatId: 1 } } }
      const entities = { chats: { 1: { chatId: 1 } } }

      queryService.apiRequest.mockResolvedValueOnce(response)

      await testEntitiesMerge(saga(), entities)
        .put(chatActions.chatCreateDirectSuccess({ data: 1, payload, meta: {} }))

        .dispatch(chatActions.chatCreateDirectRequest(payload))
        .silentRun()

      expect(queryService.apiRequest).toHaveBeenCalledWith(queries.createDirectChat, payload)
    })
  })
})
