import { gql } from "@apollo/client";
import { graphClientTestnet } from "@/lib/subgraph/client";

const GRANTS = `
  query {
    factoryDeployeds(orderBy: timestamp, orderDirection: desc) {
      keeperAddress
      accessControlAddress
      dynamicNFTAddress
      name
      profileId
      pubId
      timestamp
      deployer
    }
  }
`;

const GRANT_DETAILS = `
query($pubId: String!) {
  factoryDeployeds(orderDirection: desc, where: {pubId: $pubId}) {
    keeperAddress
    accessControlAddress
    dynamicNFTAddress
    name
    profileId
    pubId
    timestamp
    deployer
  }
}
`;

export const getAllGrants = async (): Promise<any> => {
  const queryPromise = graphClientTestnet.query({
    query: gql(GRANTS),
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

export const getGrantDetails = async (pubId: number): Promise<any> => {
  const queryPromise = graphClientTestnet.query({
    query: gql(GRANT_DETAILS),
    variables: {
      pubId: pubId,
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
