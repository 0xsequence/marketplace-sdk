import { BuyModal } from './BuyModal';
import { ListModal } from './ListModal';
import { OfferModal } from './OfferModal';
import { SellModal } from './SellModal';
import { TransferModal } from './TransferModal';

export function ModalContainer() {
	return (
		<>
			<BuyModal />
			<ListModal />
			<OfferModal />
			<SellModal />
			<TransferModal />
		</>
	);
}
