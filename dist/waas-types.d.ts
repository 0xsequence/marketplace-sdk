//#region src/types/waas-types.d.ts
type FeeOption = {
  gasLimit: number;
  to: string;
  token: {
    chainId: number;
    contractAddress: string | null;
    decimals: number;
    logoURL: string;
    name: string;
    symbol: string;
    tokenID: string | null;
    type: string;
  };
  value: string;
};
//#endregion
export { FeeOption as t };
//# sourceMappingURL=waas-types.d.ts.map