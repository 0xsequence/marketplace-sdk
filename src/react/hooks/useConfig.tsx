"use client";

import { useContext } from "react";

import { MarketplaceSdkContext } from "../provider";

export function useConfig() {
  const context = useContext(MarketplaceSdkContext);
  if (!context) {
    throw new Error(
      "Marketplace SDK must be used within a MarketplaceSdkProvider",
    );
  }
  return context;
}
