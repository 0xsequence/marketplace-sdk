/**
 * Fetches the Content-Type header of a given URL and returns the primary type if it's supported.
 * @param url The URL to send the request to.
 * @returns A Promise that resolves with 'image', 'video', 'html', or null.
 */
export function fetchContentType(
	url: string,
): Promise<'image' | 'video' | 'html' | null> {
	return new Promise((resolve, reject) => {
		if (typeof XMLHttpRequest === 'undefined') {
			reject(new Error('XMLHttpRequest is not supported in this environment.'));
			return;
		}

		const client = new XMLHttpRequest();

		client.open('HEAD', url, true);
		client.send();

		client.onload = () => {
			if (client.status < 200 || client.status >= 300) {
				resolve(null);
				return;
			}

			const contentType = client.getResponseHeader('Content-Type');

			if (!contentType) {
				resolve(null);
				return;
			}

			const type = contentType.split('/')[0];

			switch (type) {
				case 'image':
					resolve('image');
					break;
				case 'video':
					resolve('video');
					break;
				case 'text':
					if (contentType.includes('html')) {
						resolve('html');
					} else {
						resolve(null);
					}
					break;
				default:
					resolve(null);
			}
		};

		client.onerror = (error) => {
			reject(new Error('Failed to fetch resource.', { cause: error }));
		};
	});
}
