/**
 * ESLint v9 Compatible React Server Components Plugin
 * Based on https://github.com/roginfarrer/eslint-plugin-react-server-components
 */

import Components from 'eslint-plugin-react/lib/util/Components.js';
import componentUtil from 'eslint-plugin-react/lib/util/componentUtil.js';
import globals from 'globals';

const reactEvents = [
	'onCopy',
	'onCopyCapture',
	'onCut',
	'onCutCapture',
	'onPaste',
	'onPasteCapture',
	'onCompositionEnd',
	'onCompositionEndCapture',
	'onCompositionStart',
	'onCompositionStartCapture',
	'onCompositionUpdate',
	'onCompositionUpdateCapture',
	'onFocus',
	'onFocusCapture',
	'onBlur',
	'onBlurCapture',
	'onChange',
	'onChangeCapture',
	'onBeforeInput',
	'onBeforeInputCapture',
	'onInput',
	'onInputCapture',
	'onReset',
	'onResetCapture',
	'onSubmit',
	'onSubmitCapture',
	'onInvalid',
	'onInvalidCapture',
	'onLoad',
	'onLoadCapture',
	'onKeyDown',
	'onKeyDownCapture',
	'onKeyPress',
	'onKeyPressCapture',
	'onKeyUp',
	'onKeyUpCapture',
	'onAbort',
	'onAbortCapture',
	'onCanPlay',
	'onCanPlayCapture',
	'onCanPlayThrough',
	'onCanPlayThroughCapture',
	'onDurationChange',
	'onDurationChangeCapture',
	'onEmptied',
	'onEmptiedCapture',
	'onEncrypted',
	'onEncryptedCapture',
	'onEnded',
	'onEndedCapture',
	'onLoadedData',
	'onLoadedDataCapture',
	'onLoadedMetadata',
	'onLoadedMetadataCapture',
	'onLoadStart',
	'onLoadStartCapture',
	'onPause',
	'onPauseCapture',
	'onPlay',
	'onPlayCapture',
	'onPlaying',
	'onPlayingCapture',
	'onProgress',
	'onProgressCapture',
	'onRateChange',
	'onRateChangeCapture',
	'onResize',
	'onResizeCapture',
	'onSeeked',
	'onSeekedCapture',
	'onSeeking',
	'onSeekingCapture',
	'onStalled',
	'onStalledCapture',
	'onSuspend',
	'onSuspendCapture',
	'onTimeUpdate',
	'onTimeUpdateCapture',
	'onVolumeChange',
	'onVolumeChangeCapture',
	'onWaiting',
	'onWaitingCapture',
	'onAuxClick',
	'onAuxClickCapture',
	'onClick',
	'onClickCapture',
	'onContextMenu',
	'onContextMenuCapture',
	'onDoubleClick',
	'onDoubleClickCapture',
	'onDrag',
	'onDragCapture',
	'onDragEnd',
	'onDragEndCapture',
	'onDragEnter',
	'onDragEnterCapture',
	'onDragExit',
	'onDragExitCapture',
	'onDragLeave',
	'onDragLeaveCapture',
	'onDragOver',
	'onDragOverCapture',
	'onDragStart',
	'onDragStartCapture',
	'onDrop',
	'onDropCapture',
	'onMouseDown',
	'onMouseDownCapture',
	'onMouseEnter',
	'onMouseLeave',
	'onMouseMove',
	'onMouseMoveCapture',
	'onMouseOut',
	'onMouseOutCapture',
	'onMouseOver',
	'onMouseOverCapture',
	'onMouseUp',
	'onMouseUpCapture',
	'onSelect',
	'onSelectCapture',
	'onTouchCancel',
	'onTouchCancelCapture',
	'onTouchEnd',
	'onTouchEndCapture',
	'onTouchMove',
	'onTouchMoveCapture',
	'onTouchStart',
	'onTouchStartCapture',
	'onPointerDown',
	'onPointerDownCapture',
	'onPointerMove',
	'onPointerMoveCapture',
	'onPointerUp',
	'onPointerUpCapture',
	'onPointerCancel',
	'onPointerCancelCapture',
	'onPointerEnter',
	'onPointerEnterCapture',
	'onPointerLeave',
	'onPointerLeaveCapture',
	'onPointerOver',
	'onPointerOverCapture',
	'onPointerOut',
	'onPointerOutCapture',
	'onGotPointerCapture',
	'onGotPointerCaptureCapture',
	'onLostPointerCapture',
	'onLostPointerCaptureCapture',
	'onScroll',
	'onScrollCapture',
	'onWheel',
	'onWheelCapture',
	'onAnimationStart',
	'onAnimationStartCapture',
	'onAnimationEnd',
	'onAnimationEndCapture',
	'onAnimationIteration',
	'onAnimationIterationCapture',
	'onTransitionEnd',
	'onTransitionEndCapture',
];

const useClientRegex = /^('|")use client('|")/;
const browserOnlyGlobals = Object.keys(globals.browser).reduce((acc, curr) => {
	if (curr in globals.browser && !(curr in globals.node)) {
		acc.add(curr);
	}
	return acc;
}, /* @__PURE__ */ new Set());

// Create the ClientComponents rule using the object-style (required in v9)
const ClientComponents = {
	meta: {
		docs: {
			description:
				"Enforce components are appropriately labeled with 'use client'.",
			recommended: true,
		},
		type: 'problem',
		hasSuggestions: true,
		fixable: 'code',
		schema: [
			{
				type: 'object',
				properties: {
					allowedServerHooks: { type: 'array', items: { type: 'string' } },
				},
				additionalProperties: false,
			},
		],
		messages: {
			addUseClientHooks:
				'{{hook}} only works in Client Components. Add the "use client" directive at the top of the file to use it.',
			addUseClientBrowserAPI:
				'Browser APIs only work in Client Components. Add the "use client" directive at the top of the file to use it.',
			addUseClientCallbacks:
				'Functions can only be passed as props to Client Components. Add the "use client" directive at the top of the file to use it.',
			addUseClientClassComponent:
				'React Class Components can only be used in Client Components. Add the "use client" directive at the top of the file.',
			removeUseClient:
				"This file does not require the 'use client' directive, and it should be removed.",
		},
	},
	create: Components.detect((context, _, util) => {
		let hasReported = false;
		const instances = [];
		let isClientComponent = false;
		const sourceCode = context.sourceCode;
		const options = context.options?.[0] || {};
		let parentNode;
		function isClientOnlyHook(name) {
			return (
				// `useId` is the only hook that's allowed in server components
				name !== 'useId' &&
				!(options.allowedServerHooks || []).includes(name) &&
				/^use[A-Z]/.test(name)
			);
		}
		function reportMissingDirective(messageId, expression, data) {
			if (isClientComponent || hasReported) {
				return;
			}
			hasReported = true;
			context.report({
				node: expression,
				messageId,
				data,
				*fix(fixer) {
					const firstToken = sourceCode.getFirstToken(parentNode.body[0]);
					if (firstToken) {
						const isFirstLine = firstToken.loc.start.line === 1;
						yield fixer.insertTextBefore(
							firstToken,
							`${isFirstLine ? '' : '\n'}'use client';

`,
						);
					}
				},
			});
		}
		const reactImports = {
			namespace: [],
		};
		const undeclaredReferences = /* @__PURE__ */ new Set();
		return {
			Program(node) {
				for (const block of node.body) {
					if (
						block.type === 'ExpressionStatement' &&
						block.expression.type === 'Literal' &&
						block.expression.value === 'use client'
					) {
						isClientComponent = true;
					}
				}
				parentNode = node;
				const scope = sourceCode.getScope(node);
				scope.through.forEach((reference) => {
					undeclaredReferences.add(reference.identifier.name);
				});
			},
			ImportDeclaration(node) {
				if (node.source.value === 'react') {
					node.specifiers
						.filter((spec) => spec.type === 'ImportSpecifier')
						.forEach((spac) => {
							const spec = spac;
							reactImports[spec.local.name] = spec.imported.name;
						});
					const namespace = node.specifiers.find(
						(spec) =>
							spec.type === 'ImportDefaultSpecifier' ||
							spec.type === 'ImportNamespaceSpecifier',
					);
					if (namespace) {
						reactImports.namespace = [
							...reactImports.namespace,
							namespace.local.name,
						];
					}
				}
			},
			NewExpression(node) {
				const name = node.callee.name;
				if (undeclaredReferences.has(name) && browserOnlyGlobals.has(name)) {
					instances.push(name);
					reportMissingDirective('addUseClientBrowserAPI', node);
				}
			},
			CallExpression(expression) {
				let name = '';
				if (
					expression.callee.type === 'Identifier' &&
					'name' in expression.callee
				) {
					name = expression.callee.name;
				} else if (
					expression.callee.type === 'MemberExpression' &&
					'name' in expression.callee.property
				) {
					name = expression.callee.property.name;
				}
				if (
					isClientOnlyHook(name) && // Is in a function...
					sourceCode.getScope(expression).type === 'function' && // But only if that function is a component
					Boolean(util.getParentComponent(expression))
				) {
					instances.push(name);
					reportMissingDirective('addUseClientHooks', expression.callee, {
						hook: name,
					});
				}
			},
			MemberExpression(node) {
				const name = node.object.name;
				const scopeType = sourceCode.getScope(node).type;
				if (
					undeclaredReferences.has(name) &&
					browserOnlyGlobals.has(name) &&
					(scopeType === 'module' || !!util.getParentComponent(node))
				) {
					instances.push(name);
					reportMissingDirective('addUseClientBrowserAPI', node.object);
				}
			},
			ExpressionStatement(node) {
				const expression = node.expression;
				if (!expression.callee) {
					return;
				}
				if (
					expression.callee &&
					isClientOnlyHook(expression.callee.name) &&
					Boolean(util.getParentComponent(expression))
				) {
					instances.push(expression.callee.name);
					reportMissingDirective('addUseClientHooks', expression.callee, {
						hook: expression.callee.name,
					});
				}
			},
			JSXOpeningElement(node) {
				const scope = sourceCode.getScope(node);
				const fnsInScope = [];
				scope.variables.forEach((variable) => {
					variable.defs.forEach((def) => {
						if (isFunction(def)) {
							fnsInScope.push(variable.name);
						}
					});
				});
				scope.upper?.set.forEach((variable) => {
					variable.defs.forEach((def) => {
						if (isFunction(def)) {
							fnsInScope.push(variable.name);
						}
					});
				});
				for (const attribute of node.attributes) {
					if (
						attribute.type === 'JSXSpreadAttribute' ||
						attribute.value?.type !== 'JSXExpressionContainer'
					) {
						continue;
					}
					if (reactEvents.includes(attribute.name.name)) {
						reportMissingDirective('addUseClientCallbacks', attribute.name);
					}
					if (
						attribute.value?.expression.type === 'ArrowFunctionExpression' ||
						attribute.value?.expression.type === 'FunctionExpression' ||
						(attribute.value.expression.type === 'Identifier' &&
							fnsInScope.includes(attribute.value.expression.name))
					) {
						reportMissingDirective('addUseClientCallbacks', attribute);
					}
				}
			},
			ClassDeclaration(node) {
				if (componentUtil.isES6Component(node, context)) {
					instances.push(node.id?.name);
					reportMissingDirective('addUseClientClassComponent', node);
				}
			},
			'ExpressionStatement:exit'(node) {
				const value = 'value' in node.expression ? node.expression.value : '';
				if (typeof value !== 'string' || !useClientRegex.test(value)) {
					return;
				}
				if (instances.length === 0 && isClientComponent) {
					context.report({
						node,
						messageId: 'removeUseClient',
						fix(fixer) {
							return fixer.remove(node);
						},
					});
				}
			},
		};
	}),
};

function isFunction(def) {
	if (def.type === 'FunctionName') {
		return true;
	}
	if (def.node.init && def.node.init.type === 'ArrowFunctionExpression') {
		return true;
	}
	return false;
}

const plugin = {
	meta: {
		name: 'react-server-components',
	},
	rules: {
		'use-client': ClientComponents,
	},
	configs: {},
};

Object.assign(plugin.configs, {
	recommended: {
		plugins: {
			'react-server-components': plugin,
		},
		rules: {
			'react-server-components/use-client': 'error',
		},
	},
});

export default plugin;
