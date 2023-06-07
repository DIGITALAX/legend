import { gql } from "@apollo/client";
import { graphClient } from "@/lib/subgraph/client";

const ALL_ORDERS = `
  query {
      orderCreateds(orderDirection: desc) {
        buyer
        fulfillmentInformation
        orderId
        transactionHash
        blockTimestamp
        totalPrice
        fulfillerId
      }
  }
`;

const GRANT_ORDERS = `
  query($collectionIds: [Int]!) {
    dropCreateds(orderDirection: desc, where: {collectionIds_contains: $collectionIds}) {
        dropURI
        dropId
        collectionIds
        blockTimestamp
        creator
        totalPrice
        fulfillerId
      }
  }
`;

export const getAllOrders = async (): Promise<any> => {
  const queryPromise = graphClient.query({
    query: gql(ALL_ORDERS),
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

export const getGrantOrders = async (
  collectionIds_contains: number[]
): Promise<any> => {
  const queryPromise = graphClient.query({
    query: gql(GRANT_ORDERS),
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
