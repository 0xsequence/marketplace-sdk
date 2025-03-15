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
			  class="fyvr11h8 fyvr11hw fyvr11fw fyvr11gk fyvr1zc fyvr111g fyvr1v0 fyvr1x4 fyvr11vx fyvr11l8 fyvr11ow fyvr11no fyvr138"
			>
			  <span
			    class="fyvr11r2 fyvr11ik fyvr11ko fyvr11jo fyvr11jc fyvr12kf _1qxj1ib9"
			  >
			    Test Pill
			  </span>
			</div>
		`);
	});
});
