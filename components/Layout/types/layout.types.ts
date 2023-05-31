export type WalletProps = {
  handleTransaction: () => void;
  isConnected: boolean;
  buttonText: string;
  signInLoading: boolean;
};

export type UseSignInResults = {
  handleConnect: () => void;
  handleLensSignIn: () => void;
  connected: boolean;
  signInLoading: boolean;
};

