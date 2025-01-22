import { Text } from "@0xsequence/design-system";
import { useCurrency } from "../../../../../../packages/sdk/src/react";
import { useMarketplace } from "../../../lib/MarketplaceContext";
import { truncateMiddle } from "../../../../../../packages/sdk/src";

const CurrencyCell = ({ currencyAddress }: { currencyAddress: string }) => {
	const { chainId } = useMarketplace();
	const { data: currency } = useCurrency({
		chainId,
		currencyAddress,
		query: {
			enabled: !!currencyAddress,
		},
	});

	return (
		<Text fontFamily="body" color="text100">
			{currency?.symbol || truncateMiddle(currencyAddress, 3, 4)}
		</Text>
	);
};

export default CurrencyCell;