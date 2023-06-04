import { Erc20, Profile } from "@/components/home.types";
import { FormEvent, KeyboardEvent, Ref, RefObject } from "react";

export type SwitchLaunchProps = {
  profile: Profile | undefined;
  page: number;
};

export type PostDetailsProps = {
  title: string | undefined;
  setTitle: (e: string) => void;
  recipients: { recipient: string; split: number }[];
  setRecipients: (e: { recipient: string; split: number }[]) => void;
  currency: string | undefined;
  setCurrency: (e: string) => void;
  editionAmount: number;
  setEditionAmount: (e: number) => void;
  referralFee: number;
  setReferralFee: (e: number) => void;
  valueAmount: number;
  setValueAmount: (e: number) => void;
  textElement: RefObject<HTMLTextAreaElement>;
  preElement: RefObject<HTMLPreElement>;
  handlePostDescription: (e: FormEvent) => Promise<void>;
  postLoading: boolean;
  postDescription: string;
  mentionProfiles: Profile[];
  profilesOpen: boolean;
  caretCoord: {
    x: number;
    y: number;
  };
  handleMentionClick: (user: Profile) => void;
  handleKeyDownDelete: (e: KeyboardEvent<Element>) => void;
  enabledCurrencies: Erc20[];
  involved: string | undefined;
  setInvolved: (e: string) => void;
  sustained: string | undefined;
  setSustained: (e: string) => void;
  filledInAmount: number;
};

export type PreviewProps = {
  title: string | undefined;
  postDescription: string | undefined;
  referralFee: number;
  recipients: { recipient: string; split: number }[];
  editionAmount: number;
  valueAmount: number;
  currency: string | undefined;
  involved: string | undefined;
  sustained: string | undefined;
};

export type NextButtonProps = {
  page: number;
  setPage: (e: number) => void;
  text: string;
};

export type ImageUploadDynamicProps = {
  imageLoading: boolean;
  uploadZip: (e: FormEvent) => Promise<void>;
  fileUploadCount: number;
};
