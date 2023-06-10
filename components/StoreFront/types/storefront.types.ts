import { Profile } from "@/components/home.types";
import { NextRouter } from "next/router";
import { FormEvent } from "react";
import { AnyAction, Dispatch } from "redux";

export interface CollectionGraph {
  acceptedTokens: string[];
  basePrices: number[];
  printType: string;
  discount: number;
  uri: {
    description: string;
    external_url: string;
    image: string;
    name: string;
    type: string;
  };
  amount: number;
  blockTimestamp: number;
  collectionId: number;
  dropId: number;
  fulfillerId: number;
  grantCollectorsOnly: boolean;
  grantName: string;
  owner: string;
  tokenIds: number[];
  pubId: number;
  profile: Profile | undefined;
  soldTokens: number[];
}

export type AllStoreProps = {
  collectionsLoading: boolean;
  allCollections: CollectionGraph[];
  router: NextRouter;
  filterValues: {
    print: string[];
    grant: string | undefined;
    timestamp: boolean | undefined;
    tokens: string[];
    discount: boolean | undefined;
    collectors: boolean | undefined;
  };
  dispatch: Dispatch<AnyAction>;
};

export type ItemProps = {
  collection: CollectionGraph;
  router: NextRouter;
  dispatch: Dispatch<AnyAction>;
};

export type FiltersProps = {
  dispatch: Dispatch<AnyAction>;
  filterValues: {
    print: string[];
    grant: string | undefined;
    timestamp: boolean | undefined;
    tokens: string[];
    discount: boolean | undefined;
    collectors: boolean | undefined;
  };
  handleFindGrant: (e: FormEvent) => void;
};
