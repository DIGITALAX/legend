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
import launchPageCountReducer from "./reducers/launchPageCountSlice";
import storefrontValuesReducer from "./reducers/storefrontValuesSlice";
import contractValuesReducer from "./reducers/contractValuesSlice";
import collapseItemLaunchReducer from "./reducers/collapseItemLaunchSlice";
import collapseItemReducer from "./reducers/collapseItemSlice";
import pubIdReducer from "./reducers/pubIdSlice";
import upkeepIDReducer from "./reducers/upkeepIDSlice";
import productInformationReducer from "./reducers/productInformationSlice";
import allCollectionsReducer from "./reducers/allCollectionsSlice";
import grantCollectionReducer from "./reducers/grantCollectionSlice";
import allDropsReducer from "./reducers/allDropsSlice";
import dropModalReducer from "./reducers/dropModalSlice";
import filtersReducer from "./reducers/filtersSlice";
import chosenCollectionReducer from "./reducers/chosenCollectionSlice";
import imageViewerReducer from "./reducers/imageViewerSlice";
import errorReducer from "./reducers/errorSlice";
import cartItemsReducer from "./reducers/cartItemsSlice";
import fulfillmentReducer from "./reducers/fulfillmentSlice";
import litClientReducer from "./reducers/litClientSlice";
import homeGrantReducer from "./reducers/homeGrantSlice";
import grantsReducer from "./reducers/grantsSlice";
import reactIdReducer from "./reducers/reactIdSlice";
import collectOpenReducer from "./reducers/collectOpenSlice";
import secondaryCommentReducer from "./reducers/secondaryCommentSlice";
import collectValueTypeReducer from "./reducers/collectValueTypeSlice";
import canCommentReducer from "./reducers/canCommentSlice";
import approvalArgsReducer from "./reducers/approvalArgsSlice";
import commentCollectReducer from "./reducers/commentCollectSlice";
import collectInfoReducer from "./reducers/collectInfoSlice";

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
  launchPageCountReducer,
  storefrontValuesReducer,
  contractValuesReducer,
  collapseItemLaunchReducer,
  collapseItemReducer,
  pubIdReducer,
  upkeepIDReducer,
  productInformationReducer,
  allCollectionsReducer,
  grantCollectionReducer,
  allDropsReducer,
  dropModalReducer,
  filtersReducer,
  chosenCollectionReducer,
  imageViewerReducer,
  errorReducer,
  cartItemsReducer,
  fulfillmentReducer,
  litClientReducer,
  homeGrantReducer,
  grantsReducer,
  reactIdReducer,
  collectOpenReducer,
  secondaryCommentReducer,
  collectValueTypeReducer,
  canCommentReducer,
  approvalArgsReducer,
  commentCollectReducer,
  collectInfoReducer
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
