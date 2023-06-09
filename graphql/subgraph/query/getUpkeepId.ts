import { gql } from "@apollo/client";
import { graphClient } from "@/lib/subgraph/client";

const UPKEEP_IDS = `
  query {
    upkeepRegistereds {
        upkeepID
        upkeepContract
        name
        sender
        transactionHash
      }
  }
`;

export const getAllRegisteredUpkeeps = async (): Promise<any> => {
  const queryPromise = graphClient.query({
    query: gql(UPKEEP_IDS),
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
