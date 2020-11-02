import { combineReducers } from "redux"
import messages from "./messages"
import users from "./users"

//creates the following state!!
const reducers = combineReducers({
  messages,
  users
})

export default reducers
