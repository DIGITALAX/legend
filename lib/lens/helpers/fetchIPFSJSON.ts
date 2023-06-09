import { INFURA_GATEWAY } from "@/lib/constants";

const fetchIPFSJSON = async (uri: string): Promise<any> => {
  const response = await fetch(`${INFURA_GATEWAY}/${uri}`);
  const json = await response.json();
  return json;
};

export default fetchIPFSJSON;
