/**
 * @fileoverview Custom ESLint plugin to enforce Sequence SDK type conventions.
 *
 * Ensures consistent use of branded types (Address, TokenId, Amount, ChainId)
 * instead of raw primitives (string, number) for blockchain-related values.
 *
 * Supports auto-fix for type annotations (run with --fix).
 *
 * @author Sequence SDK Team
 */

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/**
 * Get the type annotation text from a node
 * @param {import('eslint').Rule.RuleContext} context
 * @param {import('@typescript-eslint/types').TSESTree.TypeNode} typeAnnotation
 * @returns {string}
 */
function getTypeText(context, typeAnnotation) {
	if (!typeAnnotation) return '';
	return context.sourceCode.getText(typeAnnotation);
}

/**
 * Replace 'string' with a new type in a type annotation string.
 * Handles union types: 'string | undefined' → 'bigint | undefined'
 * @param {string} typeText - Original type annotation text
 * @param {string} newType - Type to replace 'string' with
 * @returns {string}
 */
function replaceStringType(typeText, newType) {
	// Split by | and replace 'string' parts
	const parts = typeText.split(/\s*\|\s*/);
	const newParts = parts.map((part) => (part === 'string' ? newType : part));
	return newParts.join(' | ');
}

/**
 * Check if type annotation matches any of the allowed types
 * @param {string} typeText - The type annotation text
 * @param {string[]} allowedTypes - List of allowed type names
 * @returns {boolean}
 */
function isAllowedType(typeText, allowedTypes) {
	// Handle union types: "Address | undefined", "TokenId | null"
	const parts = typeText.split(/\s*\|\s*/);
	const nonNullableParts = parts.filter(
		(p) => p !== 'undefined' && p !== 'null',
	);

	// If there's only nullable parts (e.g., just "undefined"), skip
	if (nonNullableParts.length === 0) return true;

	// Check if any non-nullable part matches allowed types
	return nonNullableParts.some((part) =>
		allowedTypes.some((allowed) => {
			// Exact match
			if (part === allowed) return true;
			// Handle generic types like Array<Address>
			if (part.includes(`<${allowed}>`)) return true;
			if (part.includes(`${allowed}[]`)) return true;
			// Handle qualified names like Indexer.Address
			if (part.endsWith(`.${allowed}`)) return true;
			return false;
		}),
	);
}

/**
 * Check if type annotation is explicitly 'string'
 * @param {string} typeText - The type annotation text
 * @returns {boolean}
 */
function isStringType(typeText) {
	const parts = typeText.split(/\s*\|\s*/);
	return parts.some((p) => p === 'string');
}

/**
 * Check if type annotation is explicitly 'number'
 * @param {string} typeText - The type annotation text
 * @returns {boolean}
 */
function isNumberType(typeText) {
	const parts = typeText.split(/\s*\|\s*/);
	return parts.some((p) => p === 'number');
}

/**
 * Check if a node is a parameter, variable, or property with type annotation
 * @param {import('@typescript-eslint/types').TSESTree.Node} node
 * @returns {{ name: string, typeAnnotation: any } | null}
 */
function getTypedIdentifier(node) {
	// Function parameter: function foo(address: string)
	if (node.type === 'Identifier' && node.typeAnnotation?.typeAnnotation) {
		return {
			name: node.name,
			typeAnnotation: node.typeAnnotation.typeAnnotation,
		};
	}

	// Variable declarator: const address: string = ...
	if (
		node.type === 'VariableDeclarator' &&
		node.id?.type === 'Identifier' &&
		node.id.typeAnnotation?.typeAnnotation
	) {
		return {
			name: node.id.name,
			typeAnnotation: node.id.typeAnnotation.typeAnnotation,
		};
	}

	// Property signature: interface X { address: string }
	if (
		node.type === 'TSPropertySignature' &&
		node.key?.type === 'Identifier' &&
		node.typeAnnotation?.typeAnnotation
	) {
		return {
			name: node.key.name,
			typeAnnotation: node.typeAnnotation.typeAnnotation,
		};
	}

	// Property definition in type literal: { address: string }
	if (
		node.type === 'PropertyDefinition' &&
		node.key?.type === 'Identifier' &&
		node.typeAnnotation?.typeAnnotation
	) {
		return {
			name: node.key.name,
			typeAnnotation: node.typeAnnotation.typeAnnotation,
		};
	}

	return null;
}

/**
 * Create a rule that enforces specific types for identifiers matching a pattern
 * @param {Object} options
 * @param {RegExp} options.pattern - Pattern to match identifier names
 * @param {string[]} options.allowedTypes - Allowed type names
 * @param {string} options.forbiddenType - The primitive type to forbid (e.g., 'string')
 * @param {(typeText: string) => boolean} options.isForbiddenType - Function to check if type is forbidden
 * @param {string} options.expectedType - Human-readable expected type for error message
 * @param {string} options.description - Rule description
 * @param {string} [options.fixToType] - Type to auto-fix to (if not set, no auto-fix)
 * @param {boolean} [options.fixRequiresImport] - Whether the fix requires adding an import
 * @param {string} [options.fixImportSource] - Module to import from (if fixRequiresImport)
 * @returns {import('eslint').Rule.RuleModule}
 */
function createTypeEnforcementRule({
	pattern,
	allowedTypes,
	forbiddenType,
	isForbiddenType,
	expectedType,
	description,
	fixToType,
	fixRequiresImport = false,
	fixImportSource = '@0xsequence/api-client',
}) {
	return {
		meta: {
			type: 'problem',
			docs: {
				description,
				recommended: true,
			},
			fixable: fixToType ? 'code' : undefined,
			messages: {
				wrongType: `'{{name}}' should use '{{expectedType}}' instead of '{{actualType}}'. Import from @0xsequence/api-client.`,
			},
			schema: [],
		},
		create(context) {
			function checkNode(node) {
				const typed = getTypedIdentifier(node);
				if (!typed) return;

				const { name, typeAnnotation } = typed;

				if (!pattern.test(name)) return;

				const typeText = getTypeText(context, typeAnnotation);

				if (!typeText) return;

				if (isAllowedType(typeText, allowedTypes)) return;

				if (isForbiddenType(typeText)) {
					const reportOptions = {
						node: typeAnnotation,
						messageId: 'wrongType',
						data: {
							name,
							expectedType,
							actualType: forbiddenType,
						},
					};

					if (fixToType) {
						reportOptions.fix = (fixer) => {
							const fixes = [];
							const newTypeText = replaceStringType(typeText, fixToType);
							fixes.push(fixer.replaceText(typeAnnotation, newTypeText));

							if (fixRequiresImport) {
								const importFix = addImportIfMissing(
									context,
									fixer,
									fixToType,
									fixImportSource,
								);
								if (importFix) fixes.push(importFix);
							}

							return fixes;
						};
					}

					context.report(reportOptions);
				}
			}

			return {
				'FunctionDeclaration > Identifier[typeAnnotation]': checkNode,
				'FunctionExpression > Identifier[typeAnnotation]': checkNode,
				'ArrowFunctionExpression > Identifier[typeAnnotation]': checkNode,
				'TSMethodSignature > Identifier[typeAnnotation]': checkNode,
				VariableDeclarator: checkNode,
				TSPropertySignature: checkNode,
				PropertyDefinition: checkNode,
			};
		},
	};
}

/**
 * Add an import statement if the type is not already imported
 * @param {import('eslint').Rule.RuleContext} context
 * @param {import('eslint').Rule.RuleFixer} fixer
 * @param {string} typeName - The type to import
 * @param {string} source - The module to import from
 * @returns {import('eslint').Rule.Fix | null}
 */
function addImportIfMissing(context, fixer, typeName, source) {
	const sourceCode = context.sourceCode;
	const ast = sourceCode.ast;

	for (const node of ast.body) {
		if (node.type !== 'ImportDeclaration') continue;
		if (node.source.value !== source) continue;

		const hasType = node.specifiers.some(
			(spec) => spec.type === 'ImportSpecifier' && spec.imported.name === typeName,
		);
		if (hasType) return null;

		const lastSpecifier = node.specifiers[node.specifiers.length - 1];
		if (lastSpecifier && lastSpecifier.type === 'ImportSpecifier') {
			return fixer.insertTextAfter(lastSpecifier, `, ${typeName}`);
		}
	}

	const firstImport = ast.body.find((n) => n.type === 'ImportDeclaration');
	const importStatement = `import { ${typeName} } from '${source}';\n`;

	if (firstImport) {
		return fixer.insertTextBefore(firstImport, importStatement);
	}

	return fixer.insertTextBeforeRange([0, 0], importStatement);
}

// ============================================================
// RULES
// ============================================================

const enforceAddressType = createTypeEnforcementRule({
	pattern:
		/^(.*[aA]ddress|owner|recipient|sender|operator|spender|account|wallet)$/,
	allowedTypes: ['Address', '`0x${string}`', 'Hex'],
	forbiddenType: 'string',
	isForbiddenType: isStringType,
	expectedType: 'Address',
	description:
		'Enforce Address type for address-like parameters and variables',
	fixToType: 'Address',
	fixRequiresImport: true,
	fixImportSource: '@0xsequence/api-client',
});

const enforceTokenIdType = createTypeEnforcementRule({
	pattern: /^token[Ii][Dd]$/,
	allowedTypes: ['bigint', 'TokenId'],
	forbiddenType: 'string',
	isForbiddenType: isStringType,
	expectedType: 'bigint | TokenId',
	description: 'Enforce bigint/TokenId type for token ID parameters',
	fixToType: 'bigint',
});

const enforceAmountType = createTypeEnforcementRule({
	pattern:
		/^(amount|balance|price|quantity|total|subtotal|fee|cost|pricePerToken|currencyValue|tokenValue|weiValue|rawValue)$/i,
	allowedTypes: ['bigint', 'Amount', 'number'],
	forbiddenType: 'string',
	isForbiddenType: isStringType,
	expectedType: 'bigint | Amount',
	description: 'Enforce bigint/Amount type for amount-like parameters',
	fixToType: 'bigint',
});

const enforceChainIdType = createTypeEnforcementRule({
	pattern: /^chain[Ii][Dd]$/,
	allowedTypes: ['number', 'ChainId'],
	forbiddenType: 'string',
	isForbiddenType: isStringType,
	expectedType: 'number | ChainId',
	description: 'Enforce number/ChainId type for chain ID parameters',
	fixToType: 'number',
});

/**
 * Rule: no-string-bigint-fields
 *
 * Detects when common blockchain fields that should be bigint are typed as string.
 * This is a broader check that catches fields not covered by specific rules.
 */
const noStringBigintFields = {
	meta: {
		type: 'suggestion',
		docs: {
			description:
				'Suggest using bigint for fields that typically represent large numbers',
			recommended: false,
		},
		messages: {
			suggestBigint: `'{{name}}' might need to be 'bigint' instead of 'string'. Large numeric blockchain values should use bigint for precision.`,
		},
		schema: [],
	},
	create(context) {
		// Fields that commonly represent large numbers in blockchain contexts
		const bigintFieldPatterns = [
			/^(token[Ii][Dd]|tokenID)$/,
			/^(block[Nn]umber|blockNum)$/,
			/^(nonce)$/,
			/^(gas|gasLimit|gasPrice|gasUsed|maxFeePerGas|maxPriorityFeePerGas)$/,
			/^(wei|gwei|ether)$/i,
			/^.*[Aa]mount$/,
			/^.*[Bb]alance$/,
			/^.*[Ss]upply$/,
			/^.*[Qq]uantity$/,
		];

		function checkNode(node) {
			const typed = getTypedIdentifier(node);
			if (!typed) return;

			const { name, typeAnnotation } = typed;
			const typeText = getTypeText(context, typeAnnotation);

			if (!typeText) return;
			if (!isStringType(typeText)) return;

			// Check if field matches any bigint pattern
			const matchesPattern = bigintFieldPatterns.some((pattern) =>
				pattern.test(name),
			);
			if (!matchesPattern) return;

			// Skip if already handled by more specific rules
			if (/^token[Ii][Dd]$/.test(name)) return; // handled by enforce-token-id-type
			if (/^chain[Ii][Dd]$/.test(name)) return; // handled by enforce-chain-id-type
			if (
				/^(amount|balance|price|value|quantity|total|subtotal|fee|cost)$/i.test(
					name,
				)
			)
				return;

			context.report({
				node: typeAnnotation,
				messageId: 'suggestBigint',
				data: { name },
			});
		}

		return {
			VariableDeclarator: checkNode,
			TSPropertySignature: checkNode,
			PropertyDefinition: checkNode,
		};
	},
};

const noManualQueryParams = {
	meta: {
		type: 'suggestion',
		docs: {
			description:
				'Discourage manual interface/type definitions for query params. Use API request types from @0xsequence/api-client instead.',
			recommended: true,
		},
		messages: {
			noManualParams: `Avoid defining '{{name}}' manually. Derive from API request types (e.g., Pick<GetTokenMetadataArgs, ...>) or use them directly.`,
		},
		schema: [],
	},
	create(context) {
		const filename = context.filename || context.getFilename();
		const isQueryFile = /\/queries\//.test(filename);
		if (!isQueryFile) return {};

		const apiTypePatterns = [
			/Request\b/,
			/Response\b/,
			/Args\b/,
			/Input\b/,
			/Return\b/,
			/\bGet\w+/,
			/\bList\w+/,
			/\bCreate\w+/,
			/\bUpdate\w+/,
			/\bDelete\w+/,
		];

		const sdkSpecificFields = new Set([
			'marketplaceConfig',
			'includeNonTradable',
			'compareToPriceAmountRaw',
			'compareToPriceCurrencyAddress',
			'priceAmountRaw',
			'priceCurrencyAddress',
			'amountRaw',
		]);

		function getFieldNames(node) {
			const fields = [];
			if (node.type === 'TSTypeLiteral') {
				for (const member of node.members || []) {
					if (member.type === 'TSPropertySignature' && member.key?.name) {
						fields.push(member.key.name);
					}
				}
			}
			return fields;
		}

		function containsSdkSpecificFields(typeAnnotation) {
			const fields = getFieldNames(typeAnnotation);
			return fields.some((f) => sdkSpecificFields.has(f));
		}

		function extendsApiType(node) {
			if (!node.extends || node.extends.length === 0) return false;

			const sourceCode = context.sourceCode || context.getSourceCode();
			const nodeText = sourceCode.getText(node);
			const extendsMatch = nodeText.match(/extends\s+(.+?)\s*\{/s);
			if (!extendsMatch) return false;

			const extendsClause = extendsMatch[1];
			return apiTypePatterns.some((p) => p.test(extendsClause));
		}

		function derivesFromApiType(typeAnnotation) {
			const sourceCode = context.sourceCode || context.getSourceCode();
			const typeText = sourceCode.getText(typeAnnotation);

			if (/^(Pick|Omit|Extract|Exclude|Partial|Required)</.test(typeText)) {
				return apiTypePatterns.some((p) => p.test(typeText));
			}

			if (typeAnnotation.type === 'TSIntersectionType') {
				return typeAnnotation.types.some((t) => {
					const tText = sourceCode.getText(t);
					return apiTypePatterns.some((p) => p.test(tText));
				});
			}

			return false;
		}

		function getInterfaceFields(node) {
			const fields = [];
			if (node.body?.body) {
				for (const member of node.body.body) {
					if (member.type === 'TSPropertySignature' && member.key?.name) {
						fields.push(member.key.name);
					}
				}
			}
			return fields;
		}

		return {
			TSInterfaceDeclaration(node) {
				const name = node.id?.name || '';
				if (!/^Fetch\w+Params$/.test(name)) return;

				if (extendsApiType(node)) return;

				const fields = getInterfaceFields(node);
				if (fields.some((f) => sdkSpecificFields.has(f))) return;

				context.report({
					node: node.id,
					messageId: 'noManualParams',
					data: { name },
				});
			},
			TSTypeAliasDeclaration(node) {
				const name = node.id?.name || '';
				if (!/^Fetch\w+Params$/.test(name)) return;

				const typeAnnotation = node.typeAnnotation;
				if (!typeAnnotation) return;

				if (derivesFromApiType(typeAnnotation)) return;

				if (containsSdkSpecificFields(typeAnnotation)) return;

				const isObjectLiteral = typeAnnotation.type === 'TSTypeLiteral';
				if (isObjectLiteral) {
					context.report({
						node: node.id,
						messageId: 'noManualParams',
						data: { name },
					});
				}
			},
		};
	},
};

const noNamespaceTypeImports = {
	meta: {
		type: 'suggestion',
		docs: {
			description:
				'Prefer direct type imports over namespace imports (Indexer.*, Marketplace.*) for normalized types.',
			recommended: true,
		},
		messages: {
			noNamespaceImport: `Use direct import for '{{type}}' instead of '{{namespace}}.{{type}}'. Import from @0xsequence/api-client.`,
		},
		schema: [],
	},
	create(context) {
		const normalizedTypes = new Set([
			'GetTokenBalancesRequest',
			'GetTokenBalancesResponse',
			'GetTokenSuppliesRequest',
			'GetTokenSuppliesResponse',
			'GetTokenIDRangesRequest',
			'GetTokenIDRangesResponse',
			'Page',
		]);

		return {
			TSQualifiedName(node) {
				if (node.left?.type !== 'Identifier') return;

				const namespace = node.left.name;
				const typeName = node.right?.name;

				if (!['Indexer', 'Marketplace', 'Metadata'].includes(namespace)) return;
				if (!normalizedTypes.has(typeName)) return;

				context.report({
					node,
					messageId: 'noNamespaceImport',
					data: { namespace, type: typeName },
				});
			},
		};
	},
};

const noDomainFieldDefinition = {
	meta: {
		type: 'problem',
		docs: {
			description:
				'Prevent manual definition of domain fields in SDK types. These should come from @0xsequence/api-client.',
			recommended: true,
		},
		messages: {
			noDomainField: `Don't define '{{field}}' manually in SDK. Import the type from @0xsequence/api-client and use Pick/Omit/Extend.`,
		},
		schema: [],
	},
	create(context) {
		const filename = context.filename || context.getFilename();
		const isQueryFile = /\/queries\//.test(filename);
		if (!isQueryFile) return {};

		const domainFields = new Set([
			'chainId',
			'collectionAddress',
			'contractAddress',
			'tokenId',
			'accountAddress',
			'userAddress',
			'walletAddress',
			'ownerAddress',
			'balance',
			'amount',
			'quantity',
			'price',
			'pricePerToken',
			'currencyAddress',
			'orderId',
			'listingId',
			'offerId',
			'side',
			'filter',
			'page',
			'pageSize',
			'includeMetadata',
			'metadataOptions',
			'primarySaleContractAddress',
		]);

		const sdkAllowedFields = new Set([
			'config',
			'query',
			'enabled',
		]);

		return {
			TSPropertySignature(node) {
				const parent = node.parent;
				if (parent?.type !== 'TSTypeLiteral') return;

				const grandparent = parent.parent;
				if (grandparent?.type !== 'TSTypeAliasDeclaration') return;

				const typeName = grandparent.id?.name || '';
				if (!/^(Fetch\w+Params|\w+QueryOptions)$/.test(typeName)) return;

				const fieldName = node.key?.name;
				if (!fieldName) return;

				if (sdkAllowedFields.has(fieldName)) return;

				if (domainFields.has(fieldName)) {
					context.report({
						node: node.key,
						messageId: 'noDomainField',
						data: { field: fieldName },
					});
				}
			},

			TSInterfaceBody(node) {
				const parent = node.parent;
				if (parent?.type !== 'TSInterfaceDeclaration') return;

				const typeName = parent.id?.name || '';
				if (!/^(Fetch\w+Params|\w+QueryOptions)$/.test(typeName)) return;

				if (parent.extends && parent.extends.length > 0) return;

				for (const member of node.body) {
					if (member.type !== 'TSPropertySignature') continue;

					const fieldName = member.key?.name;
					if (!fieldName) continue;

					if (sdkAllowedFields.has(fieldName)) continue;

					if (domainFields.has(fieldName)) {
						context.report({
							node: member.key,
							messageId: 'noDomainField',
							data: { field: fieldName },
						});
					}
				}
			},
		};
	},
};

const requireApiTypeSource = {
	meta: {
		type: 'suggestion',
		docs: {
			description:
				'Require SDK query types to derive from @0xsequence/api-client types.',
			recommended: true,
		},
		messages: {
			requireApiType: `'{{name}}' should derive from a type in @0xsequence/api-client. Use: type {{name}} = ApiType & { config: SdkConfig }`,
			missingApiImport: `Query file defines '{{name}}' but has no type imports from @0xsequence/api-client. Import request types from the API client.`,
		},
		schema: [],
	},
	create(context) {
		const filename = context.filename || context.getFilename();
		const isQueryFile = /\/queries\//.test(filename);
		if (!isQueryFile) return {};

		let hasApiClientImport = false;
		const definedFetchTypes = [];

		return {
			ImportDeclaration(node) {
				if (node.source.value === '@0xsequence/api-client') {
					const hasTypeImport = node.specifiers.some(
						(spec) =>
							spec.type === 'ImportSpecifier' &&
							/^(Get|List|Create|Update|Delete|Check)/.test(spec.imported?.name || ''),
					);
					if (hasTypeImport) {
						hasApiClientImport = true;
					}
				}
			},

			TSTypeAliasDeclaration(node) {
				const name = node.id?.name || '';
				if (!/^Fetch\w+Params$/.test(name)) return;

				const typeAnnotation = node.typeAnnotation;
				if (!typeAnnotation) return;

				if (typeAnnotation.type === 'TSTypeLiteral') {
					definedFetchTypes.push({ node, name });
				}
			},

			TSInterfaceDeclaration(node) {
				const name = node.id?.name || '';
				if (!/^Fetch\w+Params$/.test(name)) return;

				if (!node.extends || node.extends.length === 0) {
					definedFetchTypes.push({ node, name });
				}
			},

			'Program:exit'() {
				if (definedFetchTypes.length > 0 && !hasApiClientImport) {
					for (const { node, name } of definedFetchTypes) {
						context.report({
							node: node.id || node,
							messageId: 'missingApiImport',
							data: { name },
						});
					}
				}
			},
		};
	},
};

const sdkTypesMustExtend = {
	meta: {
		type: 'problem',
		docs: {
			description:
				'SDK Fetch*Params types must extend or derive from API client types, not define fields manually.',
			recommended: true,
		},
		messages: {
			mustExtend: `'{{name}}' must derive from @0xsequence/api-client types. Pattern: type {{name}} = SomeApiRequest & { config: SdkConfig }`,
		},
		schema: [],
	},
	create(context) {
		const filename = context.filename || context.getFilename();
		const isQueryFile = /\/queries\//.test(filename);
		if (!isQueryFile) return {};

		const apiTypePatterns = [
			/Request\b/,
			/Response\b/,
			/Args\b/,
			/Input\b/,
			/Return\b/,
		];

		function isApiDerived(typeAnnotation) {
			const sourceCode = context.sourceCode || context.getSourceCode();
			const typeText = sourceCode.getText(typeAnnotation);

			return apiTypePatterns.some((p) => p.test(typeText));
		}

		return {
			TSTypeAliasDeclaration(node) {
				const name = node.id?.name || '';
				if (!/^Fetch\w+Params$/.test(name)) return;

				const typeAnnotation = node.typeAnnotation;
				if (!typeAnnotation) return;

				if (typeAnnotation.type === 'TSTypeLiteral') {
					context.report({
						node: node.id,
						messageId: 'mustExtend',
						data: { name },
					});
					return;
				}

				if (!isApiDerived(typeAnnotation)) {
					context.report({
						node: node.id,
						messageId: 'mustExtend',
						data: { name },
					});
				}
			},

			TSInterfaceDeclaration(node) {
				const name = node.id?.name || '';
				if (!/^Fetch\w+Params$/.test(name)) return;

				if (!node.extends || node.extends.length === 0) {
					context.report({
						node: node.id,
						messageId: 'mustExtend',
						data: { name },
					});
					return;
				}

				const sourceCode = context.sourceCode || context.getSourceCode();
				const nodeText = sourceCode.getText(node);
				const extendsMatch = nodeText.match(/extends\s+(.+?)\s*\{/s);

				if (!extendsMatch) {
					context.report({
						node: node.id,
						messageId: 'mustExtend',
						data: { name },
					});
					return;
				}

				const extendsClause = extendsMatch[1];
				if (!apiTypePatterns.some((p) => p.test(extendsClause))) {
					context.report({
						node: node.id,
						messageId: 'mustExtend',
						data: { name },
					});
				}
			},
		};
	},
};

// ============================================================
// PLUGIN EXPORT
// ============================================================

/** @type {import('eslint').ESLint.Plugin} */
const plugin = {
	meta: {
		name: '@sequence/eslint-plugin-types',
		version: '1.0.0',
	},
	rules: {
		'enforce-address-type': enforceAddressType,
		'enforce-token-id-type': enforceTokenIdType,
		'enforce-amount-type': enforceAmountType,
		'enforce-chain-id-type': enforceChainIdType,
		'no-string-bigint-fields': noStringBigintFields,
		'no-manual-query-params': noManualQueryParams,
		'no-namespace-type-imports': noNamespaceTypeImports,
		'no-domain-field-definition': noDomainFieldDefinition,
		'require-api-type-source': requireApiTypeSource,
		'sdk-types-must-extend': sdkTypesMustExtend,
	},
	configs: {
		recommended: {
			plugins: ['@sequence/types'],
			rules: {
				'@sequence/types/enforce-address-type': 'warn',
				'@sequence/types/enforce-token-id-type': 'warn',
				'@sequence/types/enforce-amount-type': 'warn',
				'@sequence/types/enforce-chain-id-type': 'warn',
				'@sequence/types/no-string-bigint-fields': 'warn',
				'@sequence/types/no-manual-query-params': 'warn',
				'@sequence/types/no-namespace-type-imports': 'warn',
				'@sequence/types/no-domain-field-definition': 'off',
				'@sequence/types/require-api-type-source': 'off',
				'@sequence/types/sdk-types-must-extend': 'off',
			},
		},
		strict: {
			plugins: ['@sequence/types'],
			rules: {
				'@sequence/types/enforce-address-type': 'error',
				'@sequence/types/enforce-token-id-type': 'error',
				'@sequence/types/enforce-amount-type': 'error',
				'@sequence/types/enforce-chain-id-type': 'error',
				'@sequence/types/no-string-bigint-fields': 'warn',
				'@sequence/types/no-manual-query-params': 'error',
				'@sequence/types/no-namespace-type-imports': 'error',
				'@sequence/types/no-domain-field-definition': 'error',
				'@sequence/types/require-api-type-source': 'error',
				'@sequence/types/sdk-types-must-extend': 'error',
			},
		},
	},
};

export default plugin;
