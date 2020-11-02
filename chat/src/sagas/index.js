import { takeEvery } from "redux-saga/effects"
import * as types from "../constants/ActionTypes"

//We take all actions of type ADD_MESSAGE and when this action occurs, we send a message to the WebSocket, passing the action and some details.
const handleNewMessage = function* handleNewMessage(params) {
  yield takeEvery(types.ADD_MESSAGE, (action) => {
    action.author = params.username
    params.socket.send(JSON.stringify(action))
  })
}

export default handleNewMessage
