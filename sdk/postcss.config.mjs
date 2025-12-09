import tailwindcss from '@tailwindcss/postcss';

export default {
	plugins: [tailwindcss(), transformPropertyRules()],
};

/**
 * PostCSS plugin that transforms @property rules to CSS custom properties
 *
 * This plugin converts @property declarations to CSS custom properties in :root/:host
 * to avoid issues with Tailwind CSS in shadow DOM.
 *
 * see https://github.com/tailwindlabs/tailwindcss/discussions/16772
 */
function transformPropertyRules() {
	return {
		postcssPlugin: 'transform-property-rules',
		prepare() {
			const customProperties = [];

			return {
				AtRule: {
					property: (rule) => {
						try {
							const propertyName = extractPropertyName(rule.params);
							const initialValue = extractInitialValue(rule);

							if (propertyName && initialValue) {
								customProperties.push({
									name: propertyName,
									value: initialValue,
								});
								rule.remove();
							}
						} catch (error) {
							console.warn('Failed to process @property rule:', error);
						}
					},
				},

				OnceExit(root, { Rule, Declaration }) {
					if (customProperties.length > 0) {
						const rootRule = new Rule({ selector: ':root, :host' });

						customProperties.forEach(({ name, value }) => {
							const declaration = new Declaration({
								prop: name,
								value,
							});
							rootRule.append(declaration);
						});
						root.prepend(rootRule);
					}
				},
			};
		},
	};
}

function extractPropertyName(params) {
	const match = params.match(/--[\w-]+/);
	return match?.[0] || null;
}

function extractInitialValue(rule) {
	let initialValue = '';

	rule.walkDecls('initial-value', (decl) => {
		initialValue = decl.value;
	});

	return initialValue;
}
