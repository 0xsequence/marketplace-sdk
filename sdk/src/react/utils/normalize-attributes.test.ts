import { describe, expect, test } from 'vitest';
import { processAttributes } from './normalize-attributes';

describe('processAttributes', () => {
	test('should process array attributes with trait_type and display_type', () => {
		const attributes = [
			{ trait_type: 'Background', value: 'Blue' },
			{ trait_type: 'Level', value: 5 },
			{ trait_type: 'Birthday', value: 1640995200, display_type: 'date' },
		];

		const result = processAttributes(attributes);

		expect(result).toEqual({
			Background: { name: 'Background', value: 'Blue', display_type: undefined },
			Level: { name: 'Level', value: '5', display_type: undefined },
			Birthday: {
				name: 'Birthday',
				value: '1640995200',
				display_type: 'date',
			},
		});
	});

	test('should filter out invalid array attributes', () => {
		const attributes = [
			{ trait_type: 'Valid', value: 'Yes' },
			{ value: 'No Name' },
			{ trait_type: 'NoValue' },
			'invalid string',
			123,
			null,
		] as Array<{ [key: string]: any }>;

		const result = processAttributes(attributes);

		expect(result).toEqual({
			Valid: { name: 'Valid', value: 'Yes', display_type: undefined },
		});
	});

	test('should process object-based attributes with various types', () => {
		const attributes = {
			Background: 'Blue',
			Level: 5,
			Active: true,
			metadata: { type: 'special', rarity: 'rare' },
		} as any;

		const result = processAttributes(attributes);

		expect(result).toEqual({
			Background: { name: 'Background', value: 'Blue', display_type: undefined },
			Level: { name: 'Level', value: '5', display_type: undefined },
			Active: { name: 'Active', value: 'true', display_type: undefined },
			metadata: {
				name: 'metadata',
				value: '{"type":"special","rarity":"rare"}',
				display_type: undefined,
			},
		});
	});

	test('should prefer name over trait_type when both exist', () => {
		const attributes = [
			{ name: 'CustomName', trait_type: 'TraitType', value: 'Value' },
		];

		const result = processAttributes(attributes);

		expect(result).toEqual({
			CustomName: {
				name: 'CustomName',
				value: 'Value',
				display_type: undefined,
			},
		});
	});

	test('should return empty object for invalid inputs', () => {
		expect(processAttributes(null as any)).toEqual({});
		expect(processAttributes(undefined as any)).toEqual({});
		expect(processAttributes([] as any)).toEqual({});
		expect(processAttributes({} as any)).toEqual({});
	});
});
