import { NextRouter } from "next/router";

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
}

export type AllStoreProps = {
  collectionsLoading: boolean;
  allCollections: CollectionGraph[];
  router: NextRouter;
};

export type ItemProps = {
  collection: CollectionGraph;
  router: NextRouter;
};
