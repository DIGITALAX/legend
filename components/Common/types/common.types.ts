import { Dispatch, FormEvent } from "react";
import TopBarTwo from "../modules/TopBarTwo";
import { Collection } from "@/components/Launch/types/launch.types";
import { AnyAction } from "redux";
import { Erc20, UploadedMedia } from "@/components/home.types";

export type SmallBoxProps = {
  title: string;
  value: any;
  onChangeFunction: (e: FormEvent) => void;
  collapseNumber: boolean[];
  index: number;
  dispatch: Dispatch<AnyAction>;
};

export type TopBarThreeProps = {
  text: string;
  collapseNumber?: boolean[];
  dispatch?: Dispatch<AnyAction>;
  index?: number;
};

export type TopBarTwoProps = {
  deleteFunction?: () => void;
  collapseNumber?: boolean[];
  dispatch?: Dispatch<AnyAction>;
  index?: number;
};

export type CollectionAddProps = {
  index: number;
  deleteFunction?: () => void;
  position?: {
    x: string;
    y: string;
  };
  editionAmount: number;
  productInformation: Collection;
  handleTitle: (e: FormEvent, index: number) => void;
  handleDescription: (e: FormEvent, index: number) => void;
  handleEditionAmount: (e: FormEvent, index: number) => void;
  handleCollectionPrices: (
    e: FormEvent,
    address: string,
    index: number
  ) => void;
  imageLoading: boolean[];
  handleImageUpload: (e: FormEvent, index: number) => Promise<void>;
  mintCollection: (e: number) => Promise<void>;
  minted: boolean[];
  collectionLoading: boolean[];
  handleDiscount: (e: FormEvent, index: number) => void;
  handlePrintType: (e: string, index: number) => void;
  handleGrantOnly: (e: FormEvent, index: number) => void;
};

export type TopBarOneProps = {
  collapseNumber?: boolean[];
  dispatch?: Dispatch<AnyAction>;
  index?: number;
};

export type CreateDropProps = {
  dispatch: Dispatch<AnyAction>;
  message: string | undefined;
  createDrop: () => Promise<void>;
  dropLoading: boolean;
  storefrontValues: Collection[];
};

export type TopBarFourProps = {
  index: number;
};

export type ImageViewerProps = {
  dispatch: Dispatch<AnyAction>;
  mainImage: string;
};

export type CollectInfoValuesProps = {
  buttonText: string;
  symbol?: string;
  value?: string;
  limit?: string;
  time?: string;
  totalCollected?: number;
  canClick?: boolean;
  isApproved?: boolean;
  approveCurrency?: () => Promise<void>;
  handleCollect?: (id?: string) => Promise<void>;
  collectLoading: boolean;
  approvalLoading?: boolean;
  handleLensSignIn: () => void;
  commentId: string;
  lensProfile: string | undefined;
  address: `0x${string}` | undefined;
  openConnectModal: (() => void) | undefined;
};

export type CollectInfoProps = {
  collectInfoLoading: boolean;
  approvalLoading: boolean;
  address: `0x${string}` | undefined;
  collectModuleValues: PostCollectValuesState;
  lensProfile: string;
  collectComment: (id?: any) => Promise<void>;
  collectLoading: boolean;
  approveCurrency: () => Promise<void>;
  handleLensSignIn: () => void;
  commentId: string;
  openConnectModal: (() => void) | undefined;
  dispatch: Dispatch<AnyAction>;
};

export interface PostCollectValuesState {
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

export type CollectButtonProps = {
  values?: string[] | Erc20[];
  col: string;
  row: string;
  openDropdown: boolean;
  handleOpenDropdown: (e: boolean) => void;
  selectValue: string | undefined;
  selectFunction: (e: string) => void;
  label: string;
  mixtape?: boolean;
};

export type CollectInputProps = {
  id: string;
  name: string;
  step?: string;
  min?: string;
  placeholder?: string;
  defaultValue?: string;
  col?: string;
  row?: string;
  label?: string;
  handleValueChange: (e: number) => void;
};

export type BoxImagesProps = {
  handleRemoveImage: (e: UploadedMedia, feed?: boolean) => void;
  commentLoading: boolean;
  postImagesDispatched?: UploadedMedia[];
};

export type OptionsProps = {
  videoLoading: boolean;
  imageLoading: boolean;
  commentLoading: boolean;
  uploadImage: (
    e: FormEvent,
    canvas?: boolean,
    feed?: boolean
  ) => Promise<void>;
  uploadVideo: (e: FormEvent, feed?: boolean) => Promise<void>;
  setGifOpen: (e: boolean) => void;
  gifOpen: boolean;
  collectOpen: boolean;
  dispatch: Dispatch<AnyAction>;
  commentImages: UploadedMedia[] | undefined;
};

export type ErrorProps = {
  dispatch: Dispatch<AnyAction>;
  message: string | undefined;
};
