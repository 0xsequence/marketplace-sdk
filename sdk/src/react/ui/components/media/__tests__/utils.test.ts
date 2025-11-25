import { describe, expect, it } from 'vitest';
import { getContentType } from '../utils';

describe('Media Utils', () => {
	describe('getContentType', () => {
		describe('Image Detection', () => {
			const supportedImageExtensions = [
				'jpg',
				'jpeg',
				'png',
				'gif',
				'webp',
				'svg',
			];

			supportedImageExtensions.forEach((ext) => {
				it(`should detect .${ext} as image`, async () => {
					const result = await getContentType(
						`https://example.com/image.${ext}`,
					);
					expect(result).toBe('image');
				});

				it(`should detect .${ext.toUpperCase()} as image (case insensitive)`, async () => {
					const result = await getContentType(
						`https://example.com/IMAGE.${ext.toUpperCase()}`,
					);
					expect(result).toBe('image');
				});
			});

			// Test unsupported image formats
			const unsupportedImageExtensions = ['bmp', 'ico', 'tiff', 'raw'];
			unsupportedImageExtensions.forEach((ext) => {
				it(`should reject .${ext} as unsupported`, async () => {
					await expect(
						getContentType(`https://example.com/image.${ext}`),
					).rejects.toThrow('Unsupported file type');
				});
			});
		});

		describe('Video Detection', () => {
			const videoExtensions = ['mp4', 'webm', 'ogg'];

			videoExtensions.forEach((ext) => {
				it(`should detect .${ext} as video`, async () => {
					const result = await getContentType(
						`https://example.com/video.${ext}`,
					);
					expect(result).toBe('video');
				});
			});

			// Test unsupported video formats
			const unsupportedVideoExtensions = ['mov', 'avi', 'mkv'];
			unsupportedVideoExtensions.forEach((ext) => {
				it(`should reject .${ext} as unsupported`, async () => {
					await expect(
						getContentType(`https://example.com/video.${ext}`),
					).rejects.toThrow('Unsupported file type');
				});
			});
		});

		describe('HTML Detection', () => {
			it('should detect .html as html', async () => {
				const result = await getContentType('https://example.com/page.html');
				expect(result).toBe('html');
			});
		});

		describe('3D Model Detection', () => {
			const modelExtensions = ['gltf', 'glb', 'obj', 'fbx', 'stl', 'usdz'];

			modelExtensions.forEach((ext) => {
				it(`should detect .${ext} as 3d-model`, async () => {
					const result = await getContentType(
						`https://example.com/model.${ext}`,
					);
					expect(result).toBe('3d-model');
				});
			});

			// Test unsupported 3D formats
			it('should reject .ply as unsupported', async () => {
				await expect(
					getContentType('https://example.com/model.ply'),
				).rejects.toThrow('Unsupported file type');
			});
		});

		describe('Edge Cases', () => {
			it('should handle URLs with query parameters', async () => {
				const result = await getContentType(
					'https://example.com/image.jpg?size=large&quality=high',
				);
				expect(result).toBe('image');
			});

			it('should handle URLs with fragments', async () => {
				const result = await getContentType(
					'https://example.com/video.mp4#t=10,20',
				);
				expect(result).toBe('video');
			});

			it('should handle URLs with multiple dots', async () => {
				const result = await getContentType(
					'https://example.com/my.awesome.image.png',
				);
				expect(result).toBe('image');
			});

			it('should reject URLs without extension', async () => {
				await expect(
					getContentType('https://example.com/api/media/12345'),
				).rejects.toThrow('Unsupported file type');
			});

			it('should reject malformed URLs', async () => {
				await expect(getContentType('not-a-valid-url')).rejects.toThrow(
					'Unsupported file type',
				);
			});

			it('should reject empty strings', async () => {
				await expect(getContentType('')).rejects.toThrow(
					'Unsupported file type',
				);
			});

			it('should handle URLs with spaces', async () => {
				const result = await getContentType('https://example.com/my image.jpg');
				expect(result).toBe('image');
			});

			it('should reject data URLs', async () => {
				await expect(
					getContentType('data:image/png;base64,iVBORw0KGgoAAAANS...'),
				).rejects.toThrow('Unsupported file type');
			});

			it('should reject blob URLs', async () => {
				await expect(
					getContentType('blob:https://example.com/12345-67890'),
				).rejects.toThrow('Unsupported file type');
			});
		});

		describe('Special Cases', () => {
			it('should detect IPFS URLs correctly', async () => {
				const result = await getContentType('ipfs://QmXxx/image.jpg');
				expect(result).toBe('image');
			});

			it('should handle encoded URLs', async () => {
				const result = await getContentType(
					'https://example.com/image%20with%20spaces.jpg',
				);
				expect(result).toBe('image');
			});

			it('should handle international characters', async () => {
				const result = await getContentType('https://example.com/图片.png');
				expect(result).toBe('image');
			});

			it('should handle undefined input', async () => {
				await expect(getContentType(undefined)).rejects.toThrow(
					'Unsupported file type',
				);
			});
		});

		describe('Performance', () => {
			it('should detect content type quickly', async () => {
				const start = performance.now();
				await getContentType('https://example.com/image.jpg');
				const end = performance.now();

				expect(end - start).toBeLessThan(10); // Should be near instant
			});

			it('should handle batch detection efficiently', async () => {
				const urls = Array.from(
					{ length: 100 },
					(_, i) => `https://example.com/image${i}.jpg`,
				);

				const start = performance.now();
				await Promise.all(urls.map(getContentType));
				const end = performance.now();

				expect(end - start).toBeLessThan(50); // Should be fast even for many URLs
			});
		});
	});
});
