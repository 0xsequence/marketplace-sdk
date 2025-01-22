import { formatUnits } from "viem";
import { Activity } from "../../../../../../packages/sdk/src";
import { useCurrency } from "../../../../../../packages/sdk/src/react";
import { useMarketplace } from "../../../lib/MarketplaceContext";
import { Text } from "@0xsequence/design-system";


export const PriceCell = ({ activity }: { activity: Activity }) => {
       const { chainId } = useMarketplace();
       const { data: currency } = useCurrency({
         chainId,
         currencyAddress: activity.priceCurrencyAddress || "",
         query: {
           enabled: !!activity.priceCurrencyAddress,
         },
       });
     
       if (!activity.priceAmount || !activity.priceDecimals) {
         return (
           <Text fontFamily="body" color="text100">
             -
           </Text>
         );
       }
     
       return (
         <Text fontFamily="body" color="text100">
           {formatUnits(BigInt(activity.priceAmount), activity.priceDecimals)}{" "}
           {currency?.symbol}
         </Text>
       );
     };