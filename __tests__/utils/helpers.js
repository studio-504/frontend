import { all } from 'redux-saga/effects'

export const sleep = () => new Promise((r) => setTimeout(r, 0))

export function testAsRootSaga(saga) {
  return function* pseudoRootSaga() {
    yield all(saga())
  }
}
