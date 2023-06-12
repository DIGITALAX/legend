import {
  CollectionGraph,
  PurchaseCollection,
} from "@/components/StoreFront/types/storefront.types";
import { NextRouter } from "next/router";
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
  cartItems: PurchaseCollection[];
  cartOpen: boolean;
  setCartOpen: (e: boolean) => void;
  router: NextRouter;
};
