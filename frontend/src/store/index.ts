import { combineReducers } from "redux"
import userReducer from "./modules/user"
import itemReducer from "./modules/item"


const rootReducer = combineReducers({
    user: userReducer,
    item: itemReducer
})

export { rootReducer, };