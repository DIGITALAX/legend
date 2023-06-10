import { CollectionGraph } from "@/components/StoreFront/types/storefront.types";
import { AnyAction, Dispatch } from "redux";

export type WalletProps = {
  handleTransaction: () => void;
  profile: string;
  buttonText: string;
  signInLoading: boolean;
};

export type UseSignInResults = {
  handleConnect: () => void;
  handleLensSignIn: () => void;
  connected: boolean;
  signInLoading: boolean;
};

export type CartItemsProps = {
  dispatch: Dispatch<AnyAction>;
  cartItems: CollectionGraph[];
  cartOpen: boolean;
  setCartOpen: (e: boolean) => void;
};
