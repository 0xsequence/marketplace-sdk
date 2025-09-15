import { zeroAddress } from 'viem';
import type {
	PrimarySaleTransactionParams,
	StepGenerator,
	TransactionParams,
} from '../../../../../types/transactions';
import type { Step } from '../../../../_internal/api';

export class PrimarySaleStepGenerator implements StepGenerator {

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



error
"sync collection orders collection dE(4/20, chain dEED. contractAddress= (0x631a29tecil997851ccd2466dad2be51b/Bath: tetch ustinas: net all austinas: do: breaker: breaker: hit max retries: retrvable: 500 - UnEthttos: aDi.opensea.10//aDi/V2/orders/ethereum/seaport/listings?asset&contract_address=0x63fa29fec10c997851ccd2466dad20e51b17c8af&1imit=50&order by=created date&order direction=ase) message=() errMessage=(Internal server error)