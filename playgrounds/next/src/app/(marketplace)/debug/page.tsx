'use client';

import { usePlayground } from '@/lib/PlaygroundContext';

export default function DebugPage() {
	const { sdkConfig } = usePlayground();

	return (
		<div className="flex flex-col gap-4">
			<h2 className="font-semibold text-gray-100 text-xl">Debug</h2>

			<div className="grid gap-4 rounded-lg bg-gray-800 p-4">
				<p className="text-gray-400 text-sm">
					This is where your debug implementation will go
				</p>
			</div>
		</div>
	);
}
