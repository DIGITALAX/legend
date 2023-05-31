import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import noHandleReducer from "./reducers/noHandleSlice";
import profileReducer from "./reducers/profileSlice";
import authReducer from "./reducers/authSlice";
import indexReducer from "./reducers/indexSlice";
import IPFSReducer from "./reducers/IPFSSlice";
import publicationImageReducer from "./reducers/publicationImageSlice";
import commentImagesReducer from "./reducers/commentImagesSlice";
import dispatcherReducer from "./reducers/dispatcherSlice";
import postValuesReducer from "./reducers/postValuesSlice";
import NFTImageArrayReducer from "./reducers/NFTImageArraySlice";

const reducer = combineReducers({
  noHandleReducer,
  authReducer,
  profileReducer,
  indexReducer,
  IPFSReducer,
  publicationImageReducer,
  commentImagesReducer,
  dispatcherReducer,
  postValuesReducer,
  NFTImageArrayReducer,
});

export const store = configureStore({
  reducer: {
    app: reducer,
  },
  middleware: (getDefaultMiddleware: any) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
