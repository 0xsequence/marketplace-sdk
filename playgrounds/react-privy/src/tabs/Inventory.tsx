import { InventoryPageController } from 'shared-components';
import { useReactRouterNavigation } from '../components/routing/ReactRouterAdapters';

export function Inventory() {
	const { navigateTo } = useReactRouterNavigation();

	return <InventoryPageController onNavigate={navigateTo} />;
}
