import {
  CollectionGraph,
  PurchaseCollection,
} from "@/components/StoreFront/types/storefront.types";
import { Profile, Publication } from "@/components/home.types";
import { ClipboardEvent, FormEvent, KeyboardEvent, RefObject } from "react";
import { AnyAction, Dispatch } from "redux";

export type CollectBoxProps = {
  dispatch: Dispatch<AnyAction>;
  index: number;
  collapseNumber: boolean[];
  collectGrant: (id?: string) => Promise<void>;
  collectors: any[];
  collectorsLoading: boolean;
  collectLoading: boolean;
  getMorePostCollects: () => Promise<void>;
  hasMoreCollects: boolean;
};

export type MirrorBoxProps = {
  dispatch: Dispatch<AnyAction>;
  index: number;
  collapseNumber: boolean[];
  mirrorGrant: (id?: string) => Promise<void>;
  likeGrant: (id?: string) => Promise<void>;
  mirrorLoading: boolean;
  likeLoading: boolean;
  getMorePostReactions: () => Promise<void>;
  getMorePostMirrors: () => Promise<void>;
  mirrorers: any[];
  reacters: any[];
  reactInfoLoading: boolean;
  mirrorInfoLoading: boolean;
  hasMoreReact: boolean;
  hasMoreMirror: boolean;
};

export type StorefrontBoxProps = {
  dispatch: Dispatch<AnyAction>;
  index: number;
  collapseNumber: boolean[];
  storeLoading: boolean;
  grantCollection: CollectionGraph[];
  nextItem: number;
  setNextItem: (e: number) => void;
  size: string;
  baseColor: string;
  setSize: (e: string) => void;
  setBaseColor: (e: string) => void;
  setPurchasePrice: (e: string) => void;
  currency: string;
  setCurrency: (e: string) => void;
  purchaseAmount: number;
  setPurchaseAmount: (e: number) => void;
  addItemToCart: () => void;
  canCollect: boolean;
  cartItems: PurchaseCollection[];
};

export type CommentBoxProps = {
  dispatch: Dispatch<AnyAction>;
  index: number;
  collapseNumber: boolean[];
  commentGrant: (id?: string) => void;
  commentors: any[];
  getMorePostComments: () => Promise<void>;
  commentsLoading: boolean;
  hasMoreComments: boolean;
  hasMirrored: boolean[];
  hasReacted: boolean[];
  commentorLoading: boolean;
  likeCommentLoading: boolean[];
  mirrorCommentLoading: boolean[];
  collectCommentLoading: boolean[];
  commentDescription: string;
  commentLoading: boolean;
  handleCommentDescription: (e: FormEvent) => Promise<void>;
  textElement: RefObject<HTMLTextAreaElement>;
  preElement: RefObject<HTMLPreElement>;
  caretCoord: {
    x: number;
    y: number;
  };
  mentionProfiles: Profile[];
  profilesOpen: boolean;
  handleMentionClick: (user: any) => void;
  handleKeyDownDelete: (e: KeyboardEvent<Element>) => void;
  commentId: string | undefined;
  canComment: boolean;
  handleImagePaste: (
    e: ClipboardEvent<HTMLTextAreaElement>,
    setImageLoading: (e: boolean) => void
  ) => void;
  setImageLoading: (e: boolean) => void;
  handleGifSubmit: () => Promise<void>;
  handleGif: (e: FormEvent) => void;
  results: any[];
  handleSetGif: (result: any) => void;
  setGifOpen: (e: boolean) => void;
  gifOpen: boolean;
  lensProfile: string | undefined;
  authStatus: boolean;
  collectGrant: (id?: string) => void;
  likeGrant: (id?: string) => void;
  mirrorGrant: (id?: string) => void;
  handleLensSignIn: () => void;
  handleConnect: () => void;
  collectNotif: string;
};

export type DynamicNFTProps = {
  mainURI: string;
  currentCounter: number;
  editionAmount: number;
  handleMintDynamicNFT: () => Promise<void>;
  canMint: boolean;
  mintLoading: boolean;
};

export type GrantBoxProps = {
  dispatch: Dispatch<AnyAction>;
  index: number;
  collapseNumber: boolean[];
  mainPostLoading: boolean;
  mainPostInfo: Publication | undefined;
};

export type ClaimedNFTBox = {
  dispatch: Dispatch<AnyAction>;
  index: number;
  collapseNumber: boolean[];
  getMoreProfiles: () => Promise<void>;
  NFTCollectors: Profile[];
  hasMoreProfiles: boolean;
};

export interface CollectValueType {
  freeCollectModule?: {
    followerOnly: boolean;
  };
  simpleCollectModule?: {
    collectLimit: string;
    followerOnly: boolean;
  };
  revertCollectModule?: boolean;
  feeCollectModule?: {
    amount: {
      currency: string;
      value: string;
    };
    recipient: string;
    referralFee: number;
    followerOnly: boolean;
  };
  limitedFeeCollectModule?: {
    collectLimit: string;
    amount: {
      currency: string;
      value: string;
    };
    recipient: string;
    referralFee: number;
    followerOnly: boolean;
  };
  limitedTimedFeeCollectModule?: {
    collectLimit: string;
    amount: {
      currency: string;
      value: string;
    };
    recipient: string;
    referralFee: number;
    followerOnly: boolean;
  };
  timedFeeCollectModule?: {
    amount: {
      currency: string;
      value: string;
    };
    recipient: string;
    referralFee: number;
    followerOnly: boolean;
  };
}

export interface ApprovalArgs {
  to: string;
  from: string;
  data: string;
}
