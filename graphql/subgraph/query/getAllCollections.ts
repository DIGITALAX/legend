import { gql } from "@apollo/client";
import { graphClientTestnet } from "@/lib/subgraph/client";

const ALL_COLLECTIONS = `
  query {
    collectionMinteds(orderBy: blockTimestamp) {
        amount
        acceptedTokens
        basePrices
        blockTimestamp
        collectionId
        discount
        dropId
        fulfillerId
        grantCollectorsOnly
        grantName
        owner
        printType
        uri
        tokenIds
        pubId
      }
  }
`;

const GRANT_COLLECTIONS = `query($grantName: String!) {
    collectionMinteds(where: {grantName: $grantName}, orderBy: blockTimestamp) {
        amount
        acceptedTokens
        basePrices
        blockTimestamp
        collectionId
        discount
        dropId
        fulfillerId
        grantCollectorsOnly
        grantName
        owner
        printType
        uri
        tokenIds
        pubId
      }
  }
`;

const SPECIFIC_COLLECTION = `query($collectionId: Int!) {
    collectionMinteds(orderBy: blockTimestamp, where: {collectionId: $collectionId}) {
        amount
        acceptedTokens
        basePrices
        blockTimestamp
        collectionId
        discount
        dropId
        fulfillerId
        grantCollectorsOnly
        grantName
        owner
        printType
        uri
        tokenIds
        pubId
      }
  }
`;

export const getCollections = async (): Promise<any> => {
  const queryPromise = graphClientTestnet.query({
    query: gql(ALL_COLLECTIONS),
    fetchPolicy: "no-cache",
    errorPolicy: "all",
  });

  const timeoutPromise = new Promise((resolve) => {
    setTimeout(() => {
      resolve({ timedOut: true });
    }, 20000); // 1 minute timeout
  });

  const result: any = await Promise.race([queryPromise, timeoutPromise]);
  if (result.timedOut) {
    return;
  } else {
    return result;
  }
};

export const getCollectionsGrant = async (grantName: string): Promise<any> => {
  const queryPromise = graphClientTestnet.query({
    query: gql(GRANT_COLLECTIONS),
    variables: {
      grantName: grantName,
    },
    fetchPolicy: "no-cache",
    errorPolicy: "all",
  });

  const timeoutPromise = new Promise((resolve) => {
    setTimeout(() => {
      resolve({ timedOut: true });
    }, 20000); // 1 minute timeout
  });

  const result: any = await Promise.race([queryPromise, timeoutPromise]);
  if (result.timedOut) {
    return;
  } else {
    return result;
  }
};

export const getCollection = async (collectionId: number): Promise<any> => {
  const queryPromise = graphClientTestnet.query({
    query: gql(SPECIFIC_COLLECTION),
    variables: {
      collectionId: collectionId,
    },
    fetchPolicy: "no-cache",
    errorPolicy: "all",
  });

  const timeoutPromise = new Promise((resolve) => {
    setTimeout(() => {
      resolve({ timedOut: true });
    }, 20000); // 1 minute timeout
  });

  const result: any = await Promise.race([queryPromise, timeoutPromise]);
  if (result.timedOut) {
    return;
  } else {
    return result;
  }
};
