import { gql } from "@apollo/client";
import { graphClientTestnet } from "@/lib/subgraph/client";

const ALL_DROPS = `
  query {
    dropCreateds(orderDirection: desc) {
        dropURI
        dropId
        collectionIds
        blockTimestamp
        creator
      }
  }
`;

const GRANT_DROPS = `
  query($collectionIds: [Int]!) {
    dropCreateds(orderDirection: desc, where: {collectionIds_contains: $collectionIds}) {
        dropURI
        dropId
        collectionIds
        blockTimestamp
        creator
      }
  }
`;

export const getAllDrops = async (): Promise<any> => {
  const queryPromise = graphClientTestnet.query({
    query: gql(ALL_DROPS),
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

export const getGrantDrops = async (
  collectionIds_contains: number[]
): Promise<any> => {
  const queryPromise = graphClientTestnet.query({
    query: gql(GRANT_DROPS),
    variables: {
      collectionIds_contains: collectionIds_contains,
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
