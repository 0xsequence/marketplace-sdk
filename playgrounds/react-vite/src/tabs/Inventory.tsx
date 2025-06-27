import { useNavigate } from 'react-router';
import { InventoryPageController } from 'shared-components';

export function Inventory() {
	const navigate = useNavigate();

	return <InventoryPageController onNavigate={navigate} />;
}
