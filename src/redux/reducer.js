import {combineReducers} from "redux";
const initialState = {
    titleCount: 0,
};
const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'TITLECOUNT':
            return {
                titleCount:action.titleCount
            };
        default:
            return initialState
    }
};
export default combineReducers({
    reducer
})