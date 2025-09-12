import { encodeFunctionData, zeroAddress } from 'viem';
import type {
	PrimarySaleTransactionParams,
	StepGenerator,
	TransactionParams,
} from '../../../../../types/transactions';
import { getABIManager } from '../../../../../utils/ABIManager';
import type { Step } from '../../../../_internal/api';
import { StepType } from '../../../../_internal/api';

export class PrimarySaleStepGenerator implements StepGenerator {
	private abiManager = getABIManager();

	async generateSteps(params: TransactionParams): Promise<Step[]> {
		const primaryParams = params as PrimarySaleTransactionParams;
		const steps: Step[] = [];

		if (primaryParams.paymentToken !== zeroAddress) {
			const approvalStep = await this.createApprovalStep(primaryParams);
			if (approvalStep) {
				steps.push(approvalStep);
			}
		}

		const mintStep = await this.createMintStep(primaryParams);
		steps.push(mintStep);

		return steps;
	}

	private async getAllowance(paymentToken: Address, salesContractAddress: Address): Promise<bigint> {
		const erc20ABI = this.abiManager.getABI('ERC20')
		const 

	private async createApprovalStep(
		params: PrimarySaleTransactionParams,
	): Promise<Step | null> {
		
		const erc20ABI = this.abiManager.getTokenABI('ERC20');

		const allowance = await getAllowance(params.paymentToken, params.salesContractAddress);

		const approvalCalldata = encodeFunctionData({
			abi: erc20ABI,
			functionName: 'approve',
			args: [params.salesContractAddress, BigInt(params.maxTotal)],
		});

		return {
			id: StepType.tokenApproval,
			data: approvalCalldata,
			to: params.paymentToken,
			value: '0',
			price: '0',
		};
	}

	private async createMintStep(
		params: PrimarySaleTransactionParams,
	): Promise<Step> {
		const abi = this.abiManager.getSaleContractABI(
			params.tokenType,
			params.contractVersion,
		);
		const mintCalldata = encodeFunctionData({
			abi,
			functionName: 'mint',
			args: this.formatMintArgs(params),
		});

		return {
			id: StepType.buy, // Use existing StepType.buy for consistency
			data: mintCalldata,
			to: params.salesContractAddress,
			value:
				params.paymentToken === NATIVE_TOKEN_ADDRESS ? params.maxTotal : '0',
			price: params.maxTotal,
		};
	}

	private formatMintArgs(params: PrimarySaleTransactionParams): unknown[] {
		// Format args based on the mint function signature
		// This will vary based on the contract version and type
		return [
			params.recipient || params.buyer, // to
			params.tokenIds, // tokenIds
			params.amounts, // amounts
			'0x', // data (empty bytes)
			params.paymentToken, // expectedPaymentToken
			params.maxTotal, // maxTotal
			params.merkleProof || [], // proof
		];
	}
}



error
"sync collection orders collection dE(4/20, chain dEED. contractAddress= (0x631a29tecil997851ccd2466dad2be51b/Bath: tetch ustinas: net all austinas: do: breaker: breaker: hit max retries: retrvable: 500 - UnEthttos: aDi.opensea.10//aDi/V2/orders/ethereum/seaport/listings?asset&contract_address=0x63fa29fec10c997851ccd2466dad20e51b17c8af&1imit=50&order by=created date&order direction=ase) message=() errMessage=(Internal server error)