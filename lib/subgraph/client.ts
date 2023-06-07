import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const httpLink = new HttpLink({
  uri: "https://api.thegraph.com/subgraphs/name/digitalax/legend",
});

export const graphClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

const httpLinkTestnet = new HttpLink({
  uri: "https://api.studio.thegraph.com/query/37770/legend_testnet/version/latest",
});

export const graphClientTestnet = new ApolloClient({
  link: httpLinkTestnet,
  cache: new InMemoryCache(),
});
