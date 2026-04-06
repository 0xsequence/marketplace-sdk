import { n as ClassProp, t as HTMLMotionProps } from "./index3.js";
import { ComponentProps, ComponentType, JSX, ReactNode, SVGProps } from "react";
import * as react_jsx_runtime from "react/jsx-runtime";
import { VariantProps } from "class-variance-authority";

//#region ../node_modules/.pnpm/@0xsequence+design-system@3.2.0_@types+react-dom@19.2.3_@types+react@19.2.7__@types+rea_f2f94e8fde2d88ade6b8ffe1be436d4d/node_modules/@0xsequence/design-system/dist/index.d.ts

declare const iconVariants: (props?: ({
  size?: "default" | "xxs" | "xs" | "sm" | "md" | "lg" | "xl" | null | undefined;
} & ClassProp) | undefined) => string;
interface IconProps extends SVGProps<SVGSVGElement>, VariantProps<typeof iconVariants> {}
declare const buttonVariants: (props?: ({
  size?: "xs" | "sm" | "md" | "lg" | null | undefined;
  shape?: "circle" | "square" | null | undefined;
  variant?: "destructive" | "primary" | "secondary" | "text" | "outline" | "ghost" | "emphasis" | null | undefined;
  disabled?: boolean | null | undefined;
  iconOnly?: boolean | null | undefined;
} & ClassProp) | undefined) => string;
declare function Button({
  className,
  variant,
  size,
  shape,
  iconOnly,
  disabled,
  asChild,
  ...props
}: ComponentProps<'button'> & VariantProps<typeof buttonVariants> & {
  asChild?: boolean;
}): react_jsx_runtime.JSX.Element;
declare namespace Button {
  var Helper: (props: ButtonHelperProps) => react_jsx_runtime.JSX.Element;
}
type ButtonHelperProps = ComponentProps<typeof Button> & VariantProps<typeof buttonVariants> & {
  asChild?: boolean;
  pending?: boolean;
  label?: ReactNode;
  leftIcon?: ComponentType<IconProps>;
  rightIcon?: ComponentType<IconProps>;
};
interface ImageProps extends HTMLMotionProps<'img'> {
  fadeIn?: boolean;
}
declare const Image: (props: ImageProps) => react_jsx_runtime.JSX.Element;
//#endregion
export { Image as n, Button as t };
//# sourceMappingURL=index9.d.ts.map