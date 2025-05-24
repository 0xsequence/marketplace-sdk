/**
 * Fetches the Content-Type header of a given URL and returns the primary type if it's supported.
 * @param url The URL to send the request to.
 * @returns A Promise that resolves with 'image', 'video', 'html', or null.
 */
export function fetchContentType(
	url: string | undefined,
): Promise<'image' | 'video' | 'html' | '3d-model' | null> {
	return new Promise((resolve, reject) => {
		if (typeof XMLHttpRequest === 'undefined') {
			reject(new Error('XMLHttpRequest is not supported in this environment.'));
			return;
		}

		if (!url) {
			return;
		}

		const client = new XMLHttpRequest();
		let settled = false;

		const settle = (value: 'image' | 'video' | 'html' | '3d-model' | null) => {
			if (!settled) {
				settled = true;
				resolve(value);
				client.abort();
			}
		};

		const fail = (error: Error) => {
			if (!settled) {
				settled = true;
				reject(error);
			}
		};

		client.open('HEAD', url, true);

		client.onreadystatechange = () => {
			if (settled || client.readyState < XMLHttpRequest.HEADERS_RECEIVED) {
				return;
			}

			if (client.readyState === XMLHttpRequest.HEADERS_RECEIVED) {
				const status = client.status;

				if (status < 200 || status >= 300) {
					settle(null);
					return;
				}

				const contentType = client.getResponseHeader('Content-Type');

				if (!contentType) {
					settle(null);
					return;
				}

				const primaryType = contentType.split('/')[0].toLowerCase();
				let result: 'image' | 'video' | 'html' | '3d-model' | null = null;

				switch (primaryType) {
					case 'image':
						result = 'image';
						break;
					case 'video':
						result = 'video';
						break;
					case 'text':
						if (contentType.toLowerCase().includes('html')) {
							result = 'html';
						}
						break;
					case 'model':
						result = '3d-model';
						break;
				}

				settle(result);
				return;
			}
		};

		client.onerror = (errorEvent) => {
			fail(
				new Error(`XMLHttpRequest network error for URL: ${url}`, {
					cause: errorEvent,
				}),
			);
		};

		client.onabort = () => {
			if (!settled) {
				settle(null);
			}
		};

		try {
			client.send();
		} catch (error) {
			fail(
				new Error(`Error sending XMLHttpRequest for URL: ${url}`, {
					cause: error,
				}),
			);
		}
	});
}
