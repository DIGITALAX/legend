import { Erc20 } from "@/components/home.types";
import getEnabledCurrencies from "@/graphql/lens/query/enabledCurrencies";

const availableCurrencies = async (
  setEnabledCurrencies: (e: Erc20[]) => void,
  setEnabledCurrency: (e: string) => void,
  presetCurrency?: string
): Promise<void> => {
  try {
    const response = await getEnabledCurrencies();
    if (response && response.data) {
      setEnabledCurrencies(response.data.enabledModuleCurrencies);
      setEnabledCurrency(
        presetCurrency
          ? presetCurrency
          : response.data.enabledModuleCurrencies[0]?.symbol
      );
    }
  } catch (err: any) {
    console.error(err.message);
  }
};

export default availableCurrencies;
