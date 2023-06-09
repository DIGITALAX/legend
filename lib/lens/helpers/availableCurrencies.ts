import { Erc20 } from "@/components/home.types";
import getEnabledCurrencies from "@/graphql/lens/query/enabledCurrencies";

const availableCurrencies = async (
  setEnabledCurrencies: (e: Erc20[]) => void,
  presetCurrency?: string
): Promise<void> => {
  try {
    const response = await getEnabledCurrencies();
    if (response && response.data) {
      setEnabledCurrencies(response.data.enabledModuleCurrencies);
    }
  } catch (err: any) {
    console.error(err.message);
  }
};

export default availableCurrencies;
