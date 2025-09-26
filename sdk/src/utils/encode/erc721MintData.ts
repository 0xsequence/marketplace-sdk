import { type Address, encodeFunctionData, type Hex } from 'viem';
import { ERC721_SALE_ABI_V0 } from '../abi';
import { DEFAULT_PROOF } from '../const';

interface ERC721MintArgs {
	to: Address;
	amount: bigint;
	paymentToken: Address;
	price: bigint;
	proof?: Hex[];
}

const encodeERC721MintData = ({
	to,
	amount,
	paymentToken,
	price,
	proof = DEFAULT_PROOF,
}: ERC721MintArgs): Hex => {
	const totalPrice = price * amount;

	return encodeFunctionData({
		// We get away with using V0 ABI because the mint functions are identical on V0 and V1
		abi: ERC721_SALE_ABI_V0,
		functionName: 'mint',
		args: [to, amount, paymentToken, totalPrice, proof],
	});
};

export { encodeERC721MintData };
