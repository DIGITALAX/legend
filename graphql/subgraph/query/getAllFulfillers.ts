import { gql } from "@apollo/client";
import { graphClient } from "@/lib/subgraph/client";

const FULFILLERS = `
  query {
    fulfillerCreateds(orderDirection: desc) {
        fulfillerPercent
        fulfillerId
        fulfillerAddress
    }
  }
`;

export const getAllFulfillers = async (): Promise<any> => {
  const queryPromise = graphClient.query({
    query: gql(FULFILLERS),
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
