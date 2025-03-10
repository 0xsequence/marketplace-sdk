'use client';

import { usePlayground } from '@/lib/PlaygroundContext';

export default function DebugPage() {
	const { sdkConfig } = usePlayground();

	return (
		<div className="flex flex-col gap-4">
			<h2 className="text-xl font-semibold text-gray-100">Debug</h2>

			<div className="grid gap-4 p-4 bg-gray-800 rounded-lg">
				<p className="text-sm text-gray-400">
					This is where your debug implementation will go
				</p>
			</div>
		</div>
	);
}
