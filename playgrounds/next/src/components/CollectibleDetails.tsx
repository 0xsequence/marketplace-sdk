'use client';

export interface CollectibleDetailsProps {
	name?: string;
	id: string;
	balance?: number;
}

export function CollectibleDetails({
	name,
	id,
	balance = 0,
}: CollectibleDetailsProps) {
	return (
		<div className="flex flex-col gap-3 rounded-lg border border-gray-700/30 bg-gray-800 p-4 shadow-md">
			<h3 className="font-semibold text-lg text-white">Collectible Details</h3>
			<p className="text-gray-300">{`Name: ${name || 'Unknown'}`}</p>
			<p className="text-gray-300">{`ID: ${id}`}</p>
			<p className="text-gray-300">{`You own: ${balance} of this collectible`}</p>
		</div>
	);
}
