import { createSlice } from "@reduxjs/toolkit";

export interface CommentCollectValuesState {
  type?: string;
  followerOnly?: boolean;
  limit?: string;
  recipient?: string;
  referralFee?: number;
  endTime?: string;
  optionalCollectLimit?: string;
  optionalEndTimestamp?: string;
  amount?: {
    asset?: {
      address: string;
      decimals: number;
      name: string;
      symbol: string;
    };
    value?: string;
  };
  canCollect?: boolean;
  isApproved?: boolean;
  totalCollects?: number;
}

const initialCommentCollectValuesState: CommentCollectValuesState = {
  type: "FreeCollectModuleSettings",
  followerOnly: false,
};

export const commentCollectValuesSlice = createSlice({
  name: "commentCollectValues",
  initialState: initialCommentCollectValuesState,
  reducers: {
    setCommentCollectValues: (
      state: CommentCollectValuesState,
      {
        payload: {
          actionType,
          actionFollowerOnly,
          actionLimit,
          actionRecipient,
          actionReferralFee,
          actionEndTime,
          actionAmount,
          actionCanCollect,
          actionApproved,
          actionTotalCollects,
        },
      }
    ) => {
      state.type = actionType;
      state.followerOnly = actionFollowerOnly;
      state.limit = actionLimit;
      state.recipient = actionRecipient;
      state.referralFee = actionReferralFee;
      state.endTime = actionEndTime;
      state.amount = actionAmount;
      state.canCollect = actionCanCollect;
      state.isApproved = actionApproved;
      state.totalCollects = actionTotalCollects;
    },
  },
});

export const { setCommentCollectValues } = commentCollectValuesSlice.actions;

export default commentCollectValuesSlice.reducer;
