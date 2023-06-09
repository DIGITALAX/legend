import { FetchResult, gql } from "@apollo/client";
import { graphClientTestnet } from "@/lib/subgraph/client";

const HISTORY = `
  query {
    tokensBoughts(orderDirection: desc) {
        uri
        tokenIds
        creator
        chosenAddress
        blockTimestamp
        buyer
      }
  }
`;

const BUYER_HISTORY_SPECIFIC = `
  query($buyer: String!) {
    tokensBoughts(where: {buyer: $buyer} orderBy: blockTimestamp
        orderDirection: desc) {
        uri
        tokenIds
        creator
        chosenAddress
        blockTimestamp
        transactionHash
        buyer
      }
  }
`;

const GRANT_HISTORY_SPECIFIC = `query($tokenIds_contains: [Int]!) {
    tokensBoughts(where: {tokenIds_contains: tokenIds_contains} orderBy: blockTimestamp
        orderDirection: desc) {
        uri
        tokenIds
        creator
        chosenAddress
        blockTimestamp
        transactionHash
        buyer
      }
  }`;

export const getPurchaseHistory = async (): Promise<FetchResult<any>> => {
  return graphClientTestnet.query({
    query: gql(HISTORY),
    fetchPolicy: "no-cache",
  });
};

export const getPurchaseHistorySpecific = async (
  buyer: string
): Promise<FetchResult<any>> => {
  return graphClientTestnet.query({
    query: gql(BUYER_HISTORY_SPECIFIC),
    variables: {
      buyer: buyer,
    },
    fetchPolicy: "no-cache",
  });
};

export const getPurchaseHistoryGrantSpecific = async (
  tokenIds_contains: number[]
): Promise<FetchResult<any>> => {
  return graphClientTestnet.query({
    query: gql(GRANT_HISTORY_SPECIFIC),
    variables: {
      tokenIds_contains: tokenIds_contains,
    },
    fetchPolicy: "no-cache",
  });
};
