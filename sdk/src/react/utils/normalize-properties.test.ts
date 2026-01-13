import { describe, expect, test } from 'vitest';
import { processProperties } from './normalize-properties';

describe('processProperties', () => {
	test('should process simple properties with various types', () => {
		const properties = {
			name: 'Token Name',
			level: 10,
			active: true,
		};

		const result = processProperties(properties);

		expect(result).toEqual({
			name: { name: 'name', value: 'Token Name' },
			level: { name: 'level', value: '10' },
			active: { name: 'active', value: 'true' },
		});
	});

	test('should handle nested objects with .value property', () => {
		const properties = {
			field1: { value: 'simple string' },
			field2: { value: 123 },
			metadata: { value: { type: 'special', rarity: 'rare' } },
		};

		const result = processProperties(properties);

		expect(result).toEqual({
			field1: { name: 'field1', value: 'simple string' },
			field2: { name: 'field2', value: '123' },
			metadata: {
				name: 'metadata',
				value: '{"type":"special","rarity":"rare"}',
			},
		});
	});

	test('should stringify nested objects without .value property', () => {
		const properties = {
			config: { enabled: true, level: 5 },
			tags: ['tag1', 'tag2', 'tag3'],
		};

		const result = processProperties(properties);

		expect(result).toEqual({
			config: { name: 'config', value: '{"enabled":true,"level":5}' },
			tags: { name: 'tags', value: '["tag1","tag2","tag3"]' },
		});
	});

	test('should handle null and undefined values', () => {
		const properties = {
			field1: null,
			field2: undefined,
			field3: 'valid',
		};

		const result = processProperties(properties);

		expect(result).toEqual({
			field1: { name: 'field1', value: '' },
			field2: { name: 'field2', value: '' },
			field3: { name: 'field3', value: 'valid' },
		});
	});

	test('should return empty object for invalid inputs', () => {
		expect(processProperties(null as any)).toEqual({});
		expect(processProperties(undefined)).toEqual({});
		expect(processProperties([] as any)).toEqual({});
		expect(processProperties({} as any)).toEqual({});
		expect(processProperties('invalid' as any)).toEqual({});
	});
});
