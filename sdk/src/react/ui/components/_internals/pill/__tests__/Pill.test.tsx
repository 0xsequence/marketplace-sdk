import { render } from '@test';
import { describe, expect, it } from 'vitest';
import Pill from '../Pill';

describe('Pill', () => {
	it('should render correctly', () => {
		const testText = 'Test Pill';
		const { container } = render(<Pill text={testText} />);
		const pillElement = container.firstChild;

		expect(pillElement).toMatchInlineSnapshot(`
			<div
			  id="sdk-provider"
			>
			  <div
			    class="flex w-max items-center justify-center rounded-lg bg-background-raised px-2 py-1"
			  >
			    <span
			      class="leading-inherit tracking-inherit font-inherit font-medium text-secondary text-sm"
			    >
			      Test Pill
			    </span>
			  </div>
			</div>
		`);
	});
});
