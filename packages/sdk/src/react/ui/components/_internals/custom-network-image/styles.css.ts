import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';

export const customNetworkImageRoot = recipe({
  base: {
    display: 'block',
  },
  variants: {
    size: {
      xxs: {
        width: '12px',
        height: '12px',
      },
      xs: {
        width: '14px',
        height: '14px',
      },
      sm: {
        width: '16px',
        height: '16px',
      },
      md: {
        width: '20px',
        height: '20px',
      },
      lg: {
        width: '24px',
        height: '24px',
      },
      xl: {
        width: '32px',
        height: '32px',
      },
    },
    borderRadius: {
      circle: '50%',
      lg: '12px',
      md: '8px',
      sm: '4px',
    },
  },
  defaultVariants: {
    size: 'md',
    borderRadius: 'md',
  },
});

export const originalNetworkImage = style({
    width: '100% !important',
    height: '100% !important',
});