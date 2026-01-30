/// <reference types="react" />
import React$1, { CSSProperties, JSX as JSX$1, ReactNode, useEffect } from "react";
import "react/jsx-runtime";

//#region ../node_modules/.pnpm/clsx@2.1.1/node_modules/clsx/clsx.d.mts
type ClassValue$1 = ClassArray | ClassDictionary | string | number | bigint | null | boolean | undefined;
type ClassDictionary = Record<string, any>;
type ClassArray = ClassValue$1[];
//#endregion
//#region ../node_modules/.pnpm/class-variance-authority@0.7.1/node_modules/class-variance-authority/dist/types.d.ts

type ClassValue = ClassValue$1;
type ClassProp = {
  class: ClassValue;
  className?: never;
} | {
  class?: never;
  className: ClassValue;
} | {
  class?: never;
  className?: never;
};
//#endregion
//#region ../node_modules/.pnpm/motion-utils@12.23.6/node_modules/motion-utils/dist/index.d.ts

type EasingFunction = (v: number) => number;
type BezierDefinition = readonly [number, number, number, number];
type EasingDefinition = BezierDefinition | "linear" | "easeIn" | "easeOut" | "easeInOut" | "circIn" | "circOut" | "circInOut" | "backIn" | "backOut" | "backInOut" | "anticipate";
/**
 * The easing function to use. Set as one of:
 *
 * - The name of an in-built easing function.
 * - An array of four numbers to define a cubic bezier curve.
 * - An easing function, that accepts and returns a progress value between `0` and `1`.
 *
 * @public
 */
type Easing = EasingDefinition | EasingFunction;
interface Point {
  x: number;
  y: number;
}
interface Axis {
  min: number;
  max: number;
}
interface Box {
  x: Axis;
  y: Axis;
}
interface BoundingBox {
  top: number;
  right: number;
  bottom: number;
  left: number;
}
//#endregion
//#region ../node_modules/.pnpm/motion-dom@12.23.23/node_modules/motion-dom/dist/index.d.ts
interface SVGAttributes$1 {
  accentHeight?: AnyResolvedKeyframe | undefined;
  accumulate?: "none" | "sum" | undefined;
  additive?: "replace" | "sum" | undefined;
  alignmentBaseline?: "auto" | "baseline" | "before-edge" | "text-before-edge" | "middle" | "central" | "after-edge" | "text-after-edge" | "ideographic" | "alphabetic" | "hanging" | "mathematical" | "inherit" | undefined;
  allowReorder?: "no" | "yes" | undefined;
  alphabetic?: AnyResolvedKeyframe | undefined;
  amplitude?: AnyResolvedKeyframe | undefined;
  arabicForm?: "initial" | "medial" | "terminal" | "isolated" | undefined;
  ascent?: AnyResolvedKeyframe | undefined;
  attributeName?: string | undefined;
  attributeType?: string | undefined;
  autoReverse?: boolean | undefined;
  azimuth?: AnyResolvedKeyframe | undefined;
  baseFrequency?: AnyResolvedKeyframe | undefined;
  baselineShift?: AnyResolvedKeyframe | undefined;
  baseProfile?: AnyResolvedKeyframe | undefined;
  bbox?: AnyResolvedKeyframe | undefined;
  begin?: AnyResolvedKeyframe | undefined;
  bias?: AnyResolvedKeyframe | undefined;
  by?: AnyResolvedKeyframe | undefined;
  calcMode?: AnyResolvedKeyframe | undefined;
  capHeight?: AnyResolvedKeyframe | undefined;
  clip?: AnyResolvedKeyframe | undefined;
  clipPath?: string | undefined;
  clipPathUnits?: AnyResolvedKeyframe | undefined;
  clipRule?: AnyResolvedKeyframe | undefined;
  colorInterpolation?: AnyResolvedKeyframe | undefined;
  colorInterpolationFilters?: "auto" | "sRGB" | "linearRGB" | "inherit" | undefined;
  colorProfile?: AnyResolvedKeyframe | undefined;
  colorRendering?: AnyResolvedKeyframe | undefined;
  contentScriptType?: AnyResolvedKeyframe | undefined;
  contentStyleType?: AnyResolvedKeyframe | undefined;
  cursor?: AnyResolvedKeyframe | undefined;
  cx?: AnyResolvedKeyframe | undefined;
  cy?: AnyResolvedKeyframe | undefined;
  d?: string | undefined;
  decelerate?: AnyResolvedKeyframe | undefined;
  descent?: AnyResolvedKeyframe | undefined;
  diffuseConstant?: AnyResolvedKeyframe | undefined;
  direction?: AnyResolvedKeyframe | undefined;
  display?: AnyResolvedKeyframe | undefined;
  divisor?: AnyResolvedKeyframe | undefined;
  dominantBaseline?: AnyResolvedKeyframe | undefined;
  dur?: AnyResolvedKeyframe | undefined;
  dx?: AnyResolvedKeyframe | undefined;
  dy?: AnyResolvedKeyframe | undefined;
  edgeMode?: AnyResolvedKeyframe | undefined;
  elevation?: AnyResolvedKeyframe | undefined;
  enableBackground?: AnyResolvedKeyframe | undefined;
  end?: AnyResolvedKeyframe | undefined;
  exponent?: AnyResolvedKeyframe | undefined;
  externalResourcesRequired?: boolean | undefined;
  fill?: string | undefined;
  fillOpacity?: AnyResolvedKeyframe | undefined;
  fillRule?: "nonzero" | "evenodd" | "inherit" | undefined;
  filter?: string | undefined;
  filterRes?: AnyResolvedKeyframe | undefined;
  filterUnits?: AnyResolvedKeyframe | undefined;
  floodColor?: AnyResolvedKeyframe | undefined;
  floodOpacity?: AnyResolvedKeyframe | undefined;
  focusable?: boolean | "auto" | undefined;
  fontFamily?: string | undefined;
  fontSize?: AnyResolvedKeyframe | undefined;
  fontSizeAdjust?: AnyResolvedKeyframe | undefined;
  fontStretch?: AnyResolvedKeyframe | undefined;
  fontStyle?: AnyResolvedKeyframe | undefined;
  fontVariant?: AnyResolvedKeyframe | undefined;
  fontWeight?: AnyResolvedKeyframe | undefined;
  format?: AnyResolvedKeyframe | undefined;
  fr?: AnyResolvedKeyframe | undefined;
  from?: AnyResolvedKeyframe | undefined;
  fx?: AnyResolvedKeyframe | undefined;
  fy?: AnyResolvedKeyframe | undefined;
  g1?: AnyResolvedKeyframe | undefined;
  g2?: AnyResolvedKeyframe | undefined;
  glyphName?: AnyResolvedKeyframe | undefined;
  glyphOrientationHorizontal?: AnyResolvedKeyframe | undefined;
  glyphOrientationVertical?: AnyResolvedKeyframe | undefined;
  glyphRef?: AnyResolvedKeyframe | undefined;
  gradientTransform?: string | undefined;
  gradientUnits?: string | undefined;
  hanging?: AnyResolvedKeyframe | undefined;
  horizAdvX?: AnyResolvedKeyframe | undefined;
  horizOriginX?: AnyResolvedKeyframe | undefined;
  href?: string | undefined;
  ideographic?: AnyResolvedKeyframe | undefined;
  imageRendering?: AnyResolvedKeyframe | undefined;
  in2?: AnyResolvedKeyframe | undefined;
  in?: string | undefined;
  intercept?: AnyResolvedKeyframe | undefined;
  k1?: AnyResolvedKeyframe | undefined;
  k2?: AnyResolvedKeyframe | undefined;
  k3?: AnyResolvedKeyframe | undefined;
  k4?: AnyResolvedKeyframe | undefined;
  k?: AnyResolvedKeyframe | undefined;
  kernelMatrix?: AnyResolvedKeyframe | undefined;
  kernelUnitLength?: AnyResolvedKeyframe | undefined;
  kerning?: AnyResolvedKeyframe | undefined;
  keyPoints?: AnyResolvedKeyframe | undefined;
  keySplines?: AnyResolvedKeyframe | undefined;
  keyTimes?: AnyResolvedKeyframe | undefined;
  lengthAdjust?: AnyResolvedKeyframe | undefined;
  letterSpacing?: AnyResolvedKeyframe | undefined;
  lightingColor?: AnyResolvedKeyframe | undefined;
  limitingConeAngle?: AnyResolvedKeyframe | undefined;
  local?: AnyResolvedKeyframe | undefined;
  markerEnd?: string | undefined;
  markerHeight?: AnyResolvedKeyframe | undefined;
  markerMid?: string | undefined;
  markerStart?: string | undefined;
  markerUnits?: AnyResolvedKeyframe | undefined;
  markerWidth?: AnyResolvedKeyframe | undefined;
  mask?: string | undefined;
  maskContentUnits?: AnyResolvedKeyframe | undefined;
  maskUnits?: AnyResolvedKeyframe | undefined;
  mathematical?: AnyResolvedKeyframe | undefined;
  mode?: AnyResolvedKeyframe | undefined;
  numOctaves?: AnyResolvedKeyframe | undefined;
  offset?: AnyResolvedKeyframe | undefined;
  opacity?: AnyResolvedKeyframe | undefined;
  operator?: AnyResolvedKeyframe | undefined;
  order?: AnyResolvedKeyframe | undefined;
  orient?: AnyResolvedKeyframe | undefined;
  orientation?: AnyResolvedKeyframe | undefined;
  origin?: AnyResolvedKeyframe | undefined;
  overflow?: AnyResolvedKeyframe | undefined;
  overlinePosition?: AnyResolvedKeyframe | undefined;
  overlineThickness?: AnyResolvedKeyframe | undefined;
  paintOrder?: AnyResolvedKeyframe | undefined;
  panose1?: AnyResolvedKeyframe | undefined;
  path?: string | undefined;
  pathLength?: AnyResolvedKeyframe | undefined;
  patternContentUnits?: string | undefined;
  patternTransform?: AnyResolvedKeyframe | undefined;
  patternUnits?: string | undefined;
  pointerEvents?: AnyResolvedKeyframe | undefined;
  points?: string | undefined;
  pointsAtX?: AnyResolvedKeyframe | undefined;
  pointsAtY?: AnyResolvedKeyframe | undefined;
  pointsAtZ?: AnyResolvedKeyframe | undefined;
  preserveAlpha?: boolean | undefined;
  preserveAspectRatio?: string | undefined;
  primitiveUnits?: AnyResolvedKeyframe | undefined;
  r?: AnyResolvedKeyframe | undefined;
  radius?: AnyResolvedKeyframe | undefined;
  refX?: AnyResolvedKeyframe | undefined;
  refY?: AnyResolvedKeyframe | undefined;
  renderingIntent?: AnyResolvedKeyframe | undefined;
  repeatCount?: AnyResolvedKeyframe | undefined;
  repeatDur?: AnyResolvedKeyframe | undefined;
  requiredExtensions?: AnyResolvedKeyframe | undefined;
  requiredFeatures?: AnyResolvedKeyframe | undefined;
  restart?: AnyResolvedKeyframe | undefined;
  result?: string | undefined;
  rotate?: AnyResolvedKeyframe | undefined;
  rx?: AnyResolvedKeyframe | undefined;
  ry?: AnyResolvedKeyframe | undefined;
  scale?: AnyResolvedKeyframe | undefined;
  seed?: AnyResolvedKeyframe | undefined;
  shapeRendering?: AnyResolvedKeyframe | undefined;
  slope?: AnyResolvedKeyframe | undefined;
  spacing?: AnyResolvedKeyframe | undefined;
  specularConstant?: AnyResolvedKeyframe | undefined;
  specularExponent?: AnyResolvedKeyframe | undefined;
  speed?: AnyResolvedKeyframe | undefined;
  spreadMethod?: string | undefined;
  startOffset?: AnyResolvedKeyframe | undefined;
  stdDeviation?: AnyResolvedKeyframe | undefined;
  stemh?: AnyResolvedKeyframe | undefined;
  stemv?: AnyResolvedKeyframe | undefined;
  stitchTiles?: AnyResolvedKeyframe | undefined;
  stopColor?: string | undefined;
  stopOpacity?: AnyResolvedKeyframe | undefined;
  strikethroughPosition?: AnyResolvedKeyframe | undefined;
  strikethroughThickness?: AnyResolvedKeyframe | undefined;
  string?: AnyResolvedKeyframe | undefined;
  stroke?: string | undefined;
  strokeDasharray?: AnyResolvedKeyframe | undefined;
  strokeDashoffset?: AnyResolvedKeyframe | undefined;
  strokeLinecap?: "butt" | "round" | "square" | "inherit" | undefined;
  strokeLinejoin?: "miter" | "round" | "bevel" | "inherit" | undefined;
  strokeMiterlimit?: AnyResolvedKeyframe | undefined;
  strokeOpacity?: AnyResolvedKeyframe | undefined;
  strokeWidth?: AnyResolvedKeyframe | undefined;
  surfaceScale?: AnyResolvedKeyframe | undefined;
  systemLanguage?: AnyResolvedKeyframe | undefined;
  tableValues?: AnyResolvedKeyframe | undefined;
  targetX?: AnyResolvedKeyframe | undefined;
  targetY?: AnyResolvedKeyframe | undefined;
  textAnchor?: string | undefined;
  textDecoration?: AnyResolvedKeyframe | undefined;
  textLength?: AnyResolvedKeyframe | undefined;
  textRendering?: AnyResolvedKeyframe | undefined;
  to?: AnyResolvedKeyframe | undefined;
  transform?: string | undefined;
  u1?: AnyResolvedKeyframe | undefined;
  u2?: AnyResolvedKeyframe | undefined;
  underlinePosition?: AnyResolvedKeyframe | undefined;
  underlineThickness?: AnyResolvedKeyframe | undefined;
  unicode?: AnyResolvedKeyframe | undefined;
  unicodeBidi?: AnyResolvedKeyframe | undefined;
  unicodeRange?: AnyResolvedKeyframe | undefined;
  unitsPerEm?: AnyResolvedKeyframe | undefined;
  vAlphabetic?: AnyResolvedKeyframe | undefined;
  values?: string | undefined;
  vectorEffect?: AnyResolvedKeyframe | undefined;
  version?: string | undefined;
  vertAdvY?: AnyResolvedKeyframe | undefined;
  vertOriginX?: AnyResolvedKeyframe | undefined;
  vertOriginY?: AnyResolvedKeyframe | undefined;
  vHanging?: AnyResolvedKeyframe | undefined;
  vIdeographic?: AnyResolvedKeyframe | undefined;
  viewBox?: string | undefined;
  viewTarget?: AnyResolvedKeyframe | undefined;
  visibility?: AnyResolvedKeyframe | undefined;
  vMathematical?: AnyResolvedKeyframe | undefined;
  widths?: AnyResolvedKeyframe | undefined;
  wordSpacing?: AnyResolvedKeyframe | undefined;
  writingMode?: AnyResolvedKeyframe | undefined;
  x1?: AnyResolvedKeyframe | undefined;
  x2?: AnyResolvedKeyframe | undefined;
  x?: AnyResolvedKeyframe | undefined;
  xChannelSelector?: string | undefined;
  xHeight?: AnyResolvedKeyframe | undefined;
  xlinkActuate?: string | undefined;
  xlinkArcrole?: string | undefined;
  xlinkHref?: string | undefined;
  xlinkRole?: string | undefined;
  xlinkShow?: string | undefined;
  xlinkTitle?: string | undefined;
  xlinkType?: string | undefined;
  xmlBase?: string | undefined;
  xmlLang?: string | undefined;
  xmlns?: string | undefined;
  xmlnsXlink?: string | undefined;
  xmlSpace?: string | undefined;
  y1?: AnyResolvedKeyframe | undefined;
  y2?: AnyResolvedKeyframe | undefined;
  y?: AnyResolvedKeyframe | undefined;
  yChannelSelector?: string | undefined;
  z?: AnyResolvedKeyframe | undefined;
  zoomAndPan?: string | undefined;
}

/**
 * An update function. It accepts a timestamp used to advance the animation.
 */
type Update$1 = (timestamp: number) => void;
/**
 * Drivers accept a update function and call it at an interval. This interval
 * could be a synchronous loop, a setInterval, or tied to the device's framerate.
 */
interface DriverControls {
  start: (keepAlive?: boolean) => void;
  stop: () => void;
  now: () => number;
}
type Driver = (update: Update$1) => DriverControls;

/**
 * Temporary subset of VisualElement until VisualElement is
 * moved to motion-dom
 */

type AnyResolvedKeyframe = string | number;
interface ProgressTimeline {
  currentTime: null | {
    value: number;
  };
  cancel?: VoidFunction;
}
interface TimelineWithFallback {
  timeline?: ProgressTimeline;
  observe: (animation: AnimationPlaybackControls) => VoidFunction;
}
/**
 * Methods to control an animation.
 */
interface AnimationPlaybackControls {
  /**
   * The current time of the animation, in seconds.
   */
  time: number;
  /**
   * The playback speed of the animation.
   * 1 = normal speed, 2 = double speed, 0.5 = half speed.
   */
  speed: number;
  /**
   * The start time of the animation, in milliseconds.
   */
  startTime: number | null;
  /**
   * The state of the animation.
   *
   * This is currently for internal use only.
   */
  state: AnimationPlayState;
  duration: number;
  /**
   * The duration of the animation, including any delay.
   */
  iterationDuration: number;
  /**
   * Stops the animation at its current state, and prevents it from
   * resuming when the animation is played again.
   */
  stop: () => void;
  /**
   * Plays the animation.
   */
  play: () => void;
  /**
   * Pauses the animation.
   */
  pause: () => void;
  /**
   * Completes the animation and applies the final state.
   */
  complete: () => void;
  /**
   * Cancels the animation and applies the initial state.
   */
  cancel: () => void;
  /**
   * Attaches a timeline to the animation, for instance the `ScrollTimeline`.
   *
   * This is currently for internal use only.
   */
  attachTimeline: (timeline: TimelineWithFallback) => VoidFunction;
  finished: Promise<any>;
}
type AnimationPlaybackControlsWithThen = AnimationPlaybackControls & {
  then: (onResolve: VoidFunction, onReject?: VoidFunction) => Promise<void>;
};
interface AnimationState<V$1> {
  value: V$1;
  done: boolean;
}
interface KeyframeGenerator<V$1> {
  calculatedDuration: null | number;
  next: (t: number) => AnimationState<V$1>;
  toString: () => string;
}
interface ValueAnimationOptions<V$1 extends AnyResolvedKeyframe = number> extends ValueAnimationTransition {
  keyframes: V$1[];
  element?: any;
  name?: string;
  motionValue?: MotionValue<V$1>;
  from?: any;
  isHandoff?: boolean;
  allowFlatten?: boolean;
  finalKeyframe?: V$1;
}
type GeneratorFactoryFunction = (options: ValueAnimationOptions<any>) => KeyframeGenerator<any>;
interface GeneratorFactory extends GeneratorFactoryFunction {
  applyToOptions?: (options: Transition) => Transition;
}
type AnimationGeneratorName = "decay" | "spring" | "keyframes" | "tween" | "inertia";
type AnimationGeneratorType = GeneratorFactory | AnimationGeneratorName | false;
interface AnimationPlaybackLifecycles<V$1> {
  onUpdate?: (latest: V$1) => void;
  onPlay?: () => void;
  onComplete?: () => void;
  onRepeat?: () => void;
  onStop?: () => void;
}
interface ValueAnimationTransition<V$1 = any> extends ValueTransition, AnimationPlaybackLifecycles<V$1> {
  isSync?: boolean;
}
type RepeatType = "loop" | "reverse" | "mirror";
interface AnimationPlaybackOptions {
  /**
   * The number of times to repeat the transition. Set to `Infinity` for perpetual repeating.
   *
   * Without setting `repeatType`, this will loop the animation.
   *
   * @public
   */
  repeat?: number;
  /**
   * How to repeat the animation. This can be either:
   *
   * "loop": Repeats the animation from the start
   *
   * "reverse": Alternates between forward and backwards playback
   *
   * "mirror": Switches `from` and `to` alternately
   *
   * @public
   */
  repeatType?: RepeatType;
  /**
   * When repeating an animation, `repeatDelay` will set the
   * duration of the time to wait, in seconds, between each repetition.
   *
   * @public
   */
  repeatDelay?: number;
}
interface VelocityOptions {
  velocity?: number;
  /**
   * End animation if absolute speed (in units per second) drops below this
   * value and delta is smaller than `restDelta`. Set to `0.01` by default.
   *
   * @public
   */
  restSpeed?: number;
  /**
   * End animation if distance is below this value and speed is below
   * `restSpeed`. When animation ends, spring gets "snapped" to. Set to
   * `0.01` by default.
   *
   * @public
   */
  restDelta?: number;
}
interface DurationSpringOptions {
  /**
   * The total duration of the animation. Set to `0.3` by default.
   *
   * @public
   */
  duration?: number;
  /**
   * If visualDuration is set, this will override duration.
   *
   * The visual duration is a time, set in seconds, that the animation will take to visually appear to reach its target.
   *
   * In other words, the bulk of the transition will occur before this time, and the "bouncy bit" will mostly happen after.
   *
   * This makes it easier to edit a spring, as well as visually coordinate it with other time-based animations.
   *
   * @public
   */
  visualDuration?: number;
  /**
   * `bounce` determines the "bounciness" of a spring animation.
   *
   * `0` is no bounce, and `1` is extremely bouncy.
   *
   * If `duration` is set, this defaults to `0.25`.
   *
   * Note: `bounce` and `duration` will be overridden if `stiffness`, `damping` or `mass` are set.
   *
   * @public
   */
  bounce?: number;
}
interface SpringOptions extends DurationSpringOptions, VelocityOptions {
  /**
   * Stiffness of the spring. Higher values will create more sudden movement.
   * Set to `100` by default.
   *
   * @public
   */
  stiffness?: number;
  /**
   * Strength of opposing force. If set to 0, spring will oscillate
   * indefinitely. Set to `10` by default.
   *
   * @public
   */
  damping?: number;
  /**
   * Mass of the moving object. Higher values will result in more lethargic
   * movement. Set to `1` by default.
   *
   * @public
   */
  mass?: number;
}
/**
 * @deprecated Use SpringOptions instead
 */

interface DecayOptions extends VelocityOptions {
  keyframes?: number[];
  /**
   * A higher power value equals a further target. Set to `0.8` by default.
   *
   * @public
   */
  power?: number;
  /**
   * Adjusting the time constant will change the duration of the
   * deceleration, thereby affecting its feel. Set to `700` by default.
   *
   * @public
   */
  timeConstant?: number;
  /**
   * A function that receives the automatically-calculated target and returns a new one. Useful for snapping the target to a grid.
   *
   * @public
   */
  modifyTarget?: (v: number) => number;
}
interface InertiaOptions extends DecayOptions {
  /**
   * If `min` or `max` is set, this affects the stiffness of the bounce
   * spring. Higher values will create more sudden movement. Set to `500` by
   * default.
   *
   * @public
   */
  bounceStiffness?: number;
  /**
   * If `min` or `max` is set, this affects the damping of the bounce spring.
   * If set to `0`, spring will oscillate indefinitely. Set to `10` by
   * default.
   *
   * @public
   */
  bounceDamping?: number;
  /**
   * Minimum constraint. If set, the value will "bump" against this value (or immediately spring to it if the animation starts as less than this value).
   *
   * @public
   */
  min?: number;
  /**
   * Maximum constraint. If set, the value will "bump" against this value (or immediately snap to it, if the initial animation value exceeds this value).
   *
   * @public
   */
  max?: number;
}
interface AnimationOrchestrationOptions {
  /**
   * Delay the animation by this duration (in seconds). Defaults to `0`.
   *
   * @public
   */
  delay?: number;
  /**
   * Describes the relationship between the transition and its children. Set
   * to `false` by default.
   *
   * @remarks
   * When using variants, the transition can be scheduled in relation to its
   * children with either `"beforeChildren"` to finish this transition before
   * starting children transitions, `"afterChildren"` to finish children
   * transitions before starting this transition.
   *
   * @public
   */
  when?: false | "beforeChildren" | "afterChildren" | string;
  /**
   * When using variants, children animations will start after this duration
   * (in seconds). You can add the `transition` property to both the `motion.div` and the
   * `variant` directly. Adding it to the `variant` generally offers more flexibility,
   * as it allows you to customize the delay per visual state.
   *
   * @public
   */
  delayChildren?: number | DynamicOption<number>;
  /**
   * When using variants, animations of child components can be staggered by this
   * duration (in seconds).
   *
   * For instance, if `staggerChildren` is `0.01`, the first child will be
   * delayed by `0` seconds, the second by `0.01`, the third by `0.02` and so
   * on.
   *
   * The calculated stagger delay will be added to `delayChildren`.
   *
   * @deprecated - Use `delayChildren: stagger(interval)` instead.
   */
  staggerChildren?: number;
  /**
   * The direction in which to stagger children.
   *
   * A value of `1` staggers from the first to the last while `-1`
   * staggers from the last to the first.
   *
   * @deprecated - Use `delayChildren: stagger(interval, { from: "last" })` instead.
   */
  staggerDirection?: number;
}
interface KeyframeOptions {
  /**
   * The total duration of the animation. Set to `0.3` by default.
   *
   * @public
   */
  duration?: number;
  ease?: Easing | Easing[];
  times?: number[];
}
interface ValueTransition extends AnimationOrchestrationOptions, AnimationPlaybackOptions, Omit<SpringOptions, "keyframes">, Omit<InertiaOptions, "keyframes">, KeyframeOptions {
  /**
   * Delay the animation by this duration (in seconds). Defaults to `0`.
   *
   * @public
   */
  delay?: number;
  /**
   * The duration of time already elapsed in the animation. Set to `0` by
   * default.
   */
  elapsed?: number;
  driver?: Driver;
  /**
   * Type of animation to use.
   *
   * - "tween": Duration-based animation with ease curve
   * - "spring": Physics or duration-based spring animation
   * - false: Use an instant animation
   */
  type?: AnimationGeneratorType;
  /**
   * The duration of the tween animation. Set to `0.3` by default, 0r `0.8` if animating a series of keyframes.
   *
   * @public
   */
  duration?: number;
  autoplay?: boolean;
  startTime?: number;
  from?: any;
}
/**
 * @deprecated Use KeyframeOptions instead
 */

type SVGForcedAttrTransitions = { [K in keyof SVGForcedAttrProperties]: ValueTransition };
type SVGPathTransitions = { [K in keyof SVGPathProperties]: ValueTransition };
type SVGTransitions = { [K in keyof Omit<SVGAttributes$1, "from">]: ValueTransition };
interface VariableTransitions {
  [key: `--${string}`]: ValueTransition;
}
type StyleTransitions = { [K in keyof CSSStyleDeclarationWithTransform]?: ValueTransition };
type ValueKeyframe<T extends AnyResolvedKeyframe = AnyResolvedKeyframe> = T;
type UnresolvedValueKeyframe<T extends AnyResolvedKeyframe = AnyResolvedKeyframe> = ValueKeyframe<T> | null;
type ValueKeyframesDefinition = ValueKeyframe | ValueKeyframe[] | UnresolvedValueKeyframe[];
type StyleKeyframesDefinition = { [K in keyof CSSStyleDeclarationWithTransform]?: ValueKeyframesDefinition };
type SVGKeyframesDefinition = { [K in keyof Omit<SVGAttributes$1, "from">]?: ValueKeyframesDefinition };
interface VariableKeyframesDefinition {
  [key: `--${string}`]: ValueKeyframesDefinition;
}
type SVGForcedAttrKeyframesDefinition = { [K in keyof SVGForcedAttrProperties]?: ValueKeyframesDefinition };
type SVGPathKeyframesDefinition = { [K in keyof SVGPathProperties]?: ValueKeyframesDefinition };
type DOMKeyframesDefinition = StyleKeyframesDefinition & SVGKeyframesDefinition & SVGPathKeyframesDefinition & SVGForcedAttrKeyframesDefinition & VariableKeyframesDefinition;
interface Target extends DOMKeyframesDefinition {}
type CSSPropertyKeys = { [K in keyof CSSStyleDeclaration as K extends string ? CSSStyleDeclaration[K] extends AnyResolvedKeyframe ? K : never : never]: CSSStyleDeclaration[K] };
interface CSSStyleDeclarationWithTransform extends Omit<CSSPropertyKeys, "direction" | "transition" | "x" | "y" | "z"> {
  x: number | string;
  y: number | string;
  z: number | string;
  originX: number;
  originY: number;
  originZ: number;
  translateX: number | string;
  translateY: number | string;
  translateZ: number | string;
  rotateX: number | string;
  rotateY: number | string;
  rotateZ: number | string;
  scaleX: number;
  scaleY: number;
  scaleZ: number;
  skewX: number | string;
  skewY: number | string;
  transformPerspective: number;
}
type TransitionWithValueOverrides<V$1> = ValueAnimationTransition<V$1> & StyleTransitions & SVGPathTransitions & SVGForcedAttrTransitions & SVGTransitions & VariableTransitions & {
  default?: ValueTransition;
  layout?: ValueTransition;
};
type Transition<V$1 = any> = ValueAnimationTransition<V$1> | TransitionWithValueOverrides<V$1>;
type DynamicOption<T> = (i: number, total: number) => T;
interface TransformProperties {
  x?: AnyResolvedKeyframe;
  y?: AnyResolvedKeyframe;
  z?: AnyResolvedKeyframe;
  translateX?: AnyResolvedKeyframe;
  translateY?: AnyResolvedKeyframe;
  translateZ?: AnyResolvedKeyframe;
  rotate?: AnyResolvedKeyframe;
  rotateX?: AnyResolvedKeyframe;
  rotateY?: AnyResolvedKeyframe;
  rotateZ?: AnyResolvedKeyframe;
  scale?: AnyResolvedKeyframe;
  scaleX?: AnyResolvedKeyframe;
  scaleY?: AnyResolvedKeyframe;
  scaleZ?: AnyResolvedKeyframe;
  skew?: AnyResolvedKeyframe;
  skewX?: AnyResolvedKeyframe;
  skewY?: AnyResolvedKeyframe;
  originX?: AnyResolvedKeyframe;
  originY?: AnyResolvedKeyframe;
  originZ?: AnyResolvedKeyframe;
  perspective?: AnyResolvedKeyframe;
  transformPerspective?: AnyResolvedKeyframe;
}
interface SVGForcedAttrProperties {
  attrX?: number;
  attrY?: number;
  attrScale?: number;
}
interface SVGPathProperties {
  pathLength?: number;
  pathOffset?: number;
  pathSpacing?: number;
}

/**
 * @public
 */
type Subscriber<T> = (v: T) => void;
/**
 * @public
 */
type PassiveEffect<T> = (v: T, safeSetter: (v: T) => void) => void;
type StartAnimation = (complete: () => void) => AnimationPlaybackControlsWithThen | undefined;
interface MotionValueEventCallbacks<V$1> {
  animationStart: () => void;
  animationComplete: () => void;
  animationCancel: () => void;
  change: (latestValue: V$1) => void;
  destroy: () => void;
}
interface ResolvedValues$1 {
  [key: string]: AnyResolvedKeyframe;
}
interface Owner {
  current: HTMLElement | unknown;
  getProps: () => {
    onUpdate?: (latest: ResolvedValues$1) => void;
    transformTemplate?: (transform: TransformProperties, generatedTransform: string) => string;
  };
}
interface MotionValueOptions {
  owner?: Owner;
}
/**
 * `MotionValue` is used to track the state and velocity of motion values.
 *
 * @public
 */
declare class MotionValue<V$1 = any> {
  /**
   * If a MotionValue has an owner, it was created internally within Motion
   * and therefore has no external listeners. It is therefore safe to animate via WAAPI.
   */
  owner?: Owner;
  /**
   * The current state of the `MotionValue`.
   */
  private current;
  /**
   * The previous state of the `MotionValue`.
   */
  private prev;
  /**
   * The previous state of the `MotionValue` at the end of the previous frame.
   */
  private prevFrameValue;
  /**
   * The last time the `MotionValue` was updated.
   */
  updatedAt: number;
  /**
   * The time `prevFrameValue` was updated.
   */
  prevUpdatedAt: number | undefined;
  private stopPassiveEffect?;
  /**
   * Whether the passive effect is active.
   */
  isEffectActive?: boolean;
  /**
   * A reference to the currently-controlling animation.
   */
  animation?: AnimationPlaybackControlsWithThen;
  /**
   * A list of MotionValues whose values are computed from this one.
   * This is a rough start to a proper signal-like dirtying system.
   */
  private dependents;
  /**
   * Tracks whether this value should be removed
   */
  liveStyle?: boolean;
  /**
   * @param init - The initiating value
   * @param config - Optional configuration options
   *
   * -  `transformer`: A function to transform incoming values with.
   */
  constructor(init: V$1, options?: MotionValueOptions);
  setCurrent(current: V$1): void;
  setPrevFrameValue(prevFrameValue?: V$1 | undefined): void;
  /**
   * Adds a function that will be notified when the `MotionValue` is updated.
   *
   * It returns a function that, when called, will cancel the subscription.
   *
   * When calling `onChange` inside a React component, it should be wrapped with the
   * `useEffect` hook. As it returns an unsubscribe function, this should be returned
   * from the `useEffect` function to ensure you don't add duplicate subscribers..
   *
   * ```jsx
   * export const MyComponent = () => {
   *   const x = useMotionValue(0)
   *   const y = useMotionValue(0)
   *   const opacity = useMotionValue(1)
   *
   *   useEffect(() => {
   *     function updateOpacity() {
   *       const maxXY = Math.max(x.get(), y.get())
   *       const newOpacity = transform(maxXY, [0, 100], [1, 0])
   *       opacity.set(newOpacity)
   *     }
   *
   *     const unsubscribeX = x.on("change", updateOpacity)
   *     const unsubscribeY = y.on("change", updateOpacity)
   *
   *     return () => {
   *       unsubscribeX()
   *       unsubscribeY()
   *     }
   *   }, [])
   *
   *   return <motion.div style={{ x }} />
   * }
   * ```
   *
   * @param subscriber - A function that receives the latest value.
   * @returns A function that, when called, will cancel this subscription.
   *
   * @deprecated
   */
  onChange(subscription: Subscriber<V$1>): () => void;
  /**
   * An object containing a SubscriptionManager for each active event.
   */
  private events;
  on<EventName extends keyof MotionValueEventCallbacks<V$1>>(eventName: EventName, callback: MotionValueEventCallbacks<V$1>[EventName]): VoidFunction;
  clearListeners(): void;
  /**
   * Attaches a passive effect to the `MotionValue`.
   */
  attach(passiveEffect: PassiveEffect<V$1>, stopPassiveEffect: VoidFunction): void;
  /**
   * Sets the state of the `MotionValue`.
   *
   * @remarks
   *
   * ```jsx
   * const x = useMotionValue(0)
   * x.set(10)
   * ```
   *
   * @param latest - Latest value to set.
   * @param render - Whether to notify render subscribers. Defaults to `true`
   *
   * @public
   */
  set(v: V$1): void;
  setWithVelocity(prev: V$1, current: V$1, delta: number): void;
  /**
   * Set the state of the `MotionValue`, stopping any active animations,
   * effects, and resets velocity to `0`.
   */
  jump(v: V$1, endAnimation?: boolean): void;
  dirty(): void;
  addDependent(dependent: MotionValue): void;
  removeDependent(dependent: MotionValue): void;
  updateAndNotify: (v: V$1) => void;
  /**
   * Returns the latest state of `MotionValue`
   *
   * @returns - The latest state of `MotionValue`
   *
   * @public
   */
  get(): NonNullable<V$1>;
  /**
   * @public
   */
  getPrevious(): V$1 | undefined;
  /**
   * Returns the latest velocity of `MotionValue`
   *
   * @returns - The latest velocity of `MotionValue`. Returns `0` if the state is non-numerical.
   *
   * @public
   */
  getVelocity(): number;
  hasAnimated: boolean;
  /**
   * Registers a new animation to control this `MotionValue`. Only one
   * animation can drive a `MotionValue` at one time.
   *
   * ```jsx
   * value.start()
   * ```
   *
   * @param animation - A function that starts the provided animation
   */
  start(startAnimation: StartAnimation): Promise<void>;
  /**
   * Stop the currently active animation.
   *
   * @public
   */
  stop(): void;
  /**
   * Returns `true` if this value is currently animating.
   *
   * @public
   */
  isAnimating(): boolean;
  private clearAnimation;
  /**
   * Destroy and clean up subscribers to this `MotionValue`.
   *
   * The `MotionValue` hooks like `useMotionValue` and `useTransform` automatically
   * handle the lifecycle of the returned `MotionValue`, so this method is only necessary if you've manually
   * created a `MotionValue` via the `motionValue` function.
   *
   * @public
   */
  destroy(): void;
}
type Process = (data: FrameData) => void;
type Schedule = (process: Process, keepAlive?: boolean, immediate?: boolean) => Process;
type StepId = "setup" | "read" | "resolveKeyframes" | "preUpdate" | "update" | "preRender" | "render" | "postRender";
type Batcher = { [key in StepId]: Schedule };
interface FrameData {
  delta: number;
  timestamp: number;
  isProcessing: boolean;
}
/**
 * Passed in to pan event handlers like `onPan` the `PanInfo` object contains
 * information about the current state of the tap gesture such as its
 * `point`, `delta`, `offset` and `velocity`.
 *
 * ```jsx
 * <motion.div onPan={(event, info) => {
 *   console.log(info.point.x, info.point.y)
 * }} />
 * ```
 *
 * @public
 */
interface PanInfo {
  /**
   * Contains `x` and `y` values for the current pan position relative
   * to the device or page.
   *
   * ```jsx
   * function onPan(event, info) {
   *   console.log(info.point.x, info.point.y)
   * }
   *
   * <motion.div onPan={onPan} />
   * ```
   *
   * @public
   */
  point: Point;
  /**
   * Contains `x` and `y` values for the distance moved since
   * the last event.
   *
   * ```jsx
   * function onPan(event, info) {
   *   console.log(info.delta.x, info.delta.y)
   * }
   *
   * <motion.div onPan={onPan} />
   * ```
   *
   * @public
   */
  delta: Point;
  /**
   * Contains `x` and `y` values for the distance moved from
   * the first pan event.
   *
   * ```jsx
   * function onPan(event, info) {
   *   console.log(info.offset.x, info.offset.y)
   * }
   *
   * <motion.div onPan={onPan} />
   * ```
   *
   * @public
   */
  offset: Point;
  /**
   * Contains `x` and `y` values for the current velocity of the pointer, in px/ms.
   *
   * ```jsx
   * function onPan(event, info) {
   *   console.log(info.velocity.x, info.velocity.y)
   * }
   *
   * <motion.div onPan={onPan} />
   * ```
   *
   * @public
   */
  velocity: Point;
}
type DragElastic = boolean | number | Partial<BoundingBox>;
interface EventInfo {
  point: Point;
}
/**
 * A generic set of string/number values
 */
interface ResolvedValues$2 {
  [key: string]: AnyResolvedKeyframe;
}
type AnimationDefinition = VariantLabels$1 | TargetAndTransition | TargetResolver;
/**
 * An object that specifies values to animate to. Each value may be set either as
 * a single value, or an array of values.
 *
 * It may also option contain these properties:
 *
 * - `transition`: Specifies transitions for all or individual values.
 * - `transitionEnd`: Specifies values to set when the animation finishes.
 *
 * ```jsx
 * const target = {
 *   x: "0%",
 *   opacity: 0,
 *   transition: { duration: 1 },
 *   transitionEnd: { display: "none" }
 * }
 * ```
 *
 * @public
 */
type TargetAndTransition = Target & {
  transition?: Transition;
  transitionEnd?: ResolvedValues$2;
};
type TargetResolver = (custom: any, current: ResolvedValues$2, velocity: ResolvedValues$2) => TargetAndTransition | string;
/**
 * Either a string, or array of strings, that reference variants defined via the `variants` prop.
 * @public
 */
type VariantLabels$1 = string | string[];
type Variant = TargetAndTransition | TargetResolver;
interface Variants {
  [key: string]: Variant;
}
/**
 * @deprecated
 */
type LegacyAnimationControls = {
  /**
   * Subscribes a component's animation controls to this.
   *
   * @param controls - The controls to subscribe
   * @returns An unsubscribe function.
   */
  subscribe(visualElement: any): () => void;
  /**
   * Starts an animation on all linked components.
   *
   * @remarks
   *
   * ```jsx
   * controls.start("variantLabel")
   * controls.start({
   *   x: 0,
   *   transition: { duration: 1 }
   * })
   * ```
   *
   * @param definition - Properties or variant label to animate to
   * @param transition - Optional `transition` to apply to a variant
   * @returns - A `Promise` that resolves when all animations have completed.
   *
   * @public
   */
  start(definition: AnimationDefinition, transitionOverride?: Transition): Promise<any>;
  /**
   * Instantly set to a set of properties or a variant.
   *
   * ```jsx
   * // With properties
   * controls.set({ opacity: 0 })
   *
   * // With variants
   * controls.set("hidden")
   * ```
   *
   * @privateRemarks
   * We could perform a similar trick to `.start` where this can be called before mount
   * and we maintain a list of of pending actions that get applied on mount. But the
   * expectation of `set` is that it happens synchronously and this would be difficult
   * to do before any children have even attached themselves. It's also poor practise
   * and we should discourage render-synchronous `.start` calls rather than lean into this.
   *
   * @public
   */
  set(definition: AnimationDefinition): void;
  /**
   * Stops animations on all linked components.
   *
   * ```jsx
   * controls.stop()
   * ```
   *
   * @public
   */
  stop(): void;
  mount(): () => void;
};
interface MotionNodeAnimationOptions {
  /**
   * Properties, variant label or array of variant labels to start in.
   *
   * Set to `false` to initialise with the values in `animate` (disabling the mount animation)
   *
   * ```jsx
   * // As values
   * <motion.div initial={{ opacity: 1 }} />
   *
   * // As variant
   * <motion.div initial="visible" variants={variants} />
   *
   * // Multiple variants
   * <motion.div initial={["visible", "active"]} variants={variants} />
   *
   * // As false (disable mount animation)
   * <motion.div initial={false} animate={{ opacity: 0 }} />
   * ```
   */
  initial?: TargetAndTransition | VariantLabels$1 | boolean;
  /**
   * Values to animate to, variant label(s), or `LegacyAnimationControls`.
   *
   * ```jsx
   * // As values
   * <motion.div animate={{ opacity: 1 }} />
   *
   * // As variant
   * <motion.div animate="visible" variants={variants} />
   *
   * // Multiple variants
   * <motion.div animate={["visible", "active"]} variants={variants} />
   *
   * // LegacyAnimationControls
   * <motion.div animate={animation} />
   * ```
   */
  animate?: TargetAndTransition | VariantLabels$1 | boolean | LegacyAnimationControls;
  /**
   * A target to animate to when this component is removed from the tree.
   *
   * This component **must** be the first animatable child of an `AnimatePresence` to enable this exit animation.
   *
   * This limitation exists because React doesn't allow components to defer unmounting until after
   * an animation is complete. Once this limitation is fixed, the `AnimatePresence` component will be unnecessary.
   *
   * ```jsx
   * import { AnimatePresence, motion } from 'framer-motion'
   *
   * export const MyComponent = ({ isVisible }) => {
   *   return (
   *     <AnimatePresence>
   *        {isVisible && (
   *          <motion.div
   *            initial={{ opacity: 0 }}
   *            animate={{ opacity: 1 }}
   *            exit={{ opacity: 0 }}
   *          />
   *        )}
   *     </AnimatePresence>
   *   )
   * }
   * ```
   */
  exit?: TargetAndTransition | VariantLabels$1;
  /**
   * Variants allow you to define animation states and organise them by name. They allow
   * you to control animations throughout a component tree by switching a single `animate` prop.
   *
   * Using `transition` options like `delayChildren` and `when`, you can orchestrate
   * when children animations play relative to their parent.
    *
   * After passing variants to one or more `motion` component's `variants` prop, these variants
   * can be used in place of values on the `animate`, `initial`, `whileFocus`, `whileTap` and `whileHover` props.
   *
   * ```jsx
   * const variants = {
   *   active: {
   *       backgroundColor: "#f00"
   *   },
   *   inactive: {
   *     backgroundColor: "#fff",
   *     transition: { duration: 2 }
   *   }
   * }
   *
   * <motion.div variants={variants} animate="active" />
   * ```
   */
  variants?: Variants;
  /**
   * Default transition. If no `transition` is defined in `animate`, it will use the transition defined here.
   * ```jsx
   * const spring = {
   *   type: "spring",
   *   damping: 10,
   *   stiffness: 100
   * }
   *
   * <motion.div transition={spring} animate={{ scale: 1.2 }} />
   * ```
   */
  transition?: Transition;
}
interface MotionNodeEventOptions {
  /**
   * Callback with latest motion values, fired max once per frame.
   *
   * ```jsx
   * function onUpdate(latest) {
   *   console.log(latest.x, latest.opacity)
   * }
   *
   * <motion.div animate={{ x: 100, opacity: 0 }} onUpdate={onUpdate} />
   * ```
   */
  onUpdate?(latest: ResolvedValues$2): void;
  /**
   * Callback when animation defined in `animate` begins.
   *
   * The provided callback will be called with the triggering animation definition.
   * If this is a variant, it'll be the variant name, and if a target object
   * then it'll be the target object.
   *
   * This way, it's possible to figure out which animation has started.
   *
   * ```jsx
   * function onStart() {
   *   console.log("Animation started")
   * }
   *
   * <motion.div animate={{ x: 100 }} onAnimationStart={onStart} />
   * ```
   */
  onAnimationStart?(definition: AnimationDefinition): void;
  /**
   * Callback when animation defined in `animate` is complete.
   *
   * The provided callback will be called with the triggering animation definition.
   * If this is a variant, it'll be the variant name, and if a target object
   * then it'll be the target object.
   *
   * This way, it's possible to figure out which animation has completed.
   *
   * ```jsx
   * function onComplete() {
   *   console.log("Animation completed")
   * }
   *
   * <motion.div
   *   animate={{ x: 100 }}
   *   onAnimationComplete={definition => {
   *     console.log('Completed animating', definition)
   *   }}
   * />
   * ```
   */
  onAnimationComplete?(definition: AnimationDefinition): void;
  onBeforeLayoutMeasure?(box: Box): void;
  onLayoutMeasure?(box: Box, prevBox: Box): void;
  onLayoutAnimationStart?(): void;
  onLayoutAnimationComplete?(): void;
}
interface MotionNodePanHandlers {
  /**
   * Callback function that fires when the pan gesture is recognised on this element.
   *
   * **Note:** For pan gestures to work correctly with touch input, the element needs
   * touch scrolling to be disabled on either x/y or both axis with the
   * [touch-action](https://developer.mozilla.org/en-US/docs/Web/CSS/touch-action) CSS rule.
   *
   * ```jsx
   * function onPan(event, info) {
   *   console.log(info.point.x, info.point.y)
   * }
   *
   * <motion.div onPan={onPan} />
   * ```
   *
   * @param event - The originating pointer event.
   * @param info - A {@link PanInfo} object containing `x` and `y` values for:
   *
   *   - `point`: Relative to the device or page.
   *   - `delta`: Distance moved since the last event.
   *   - `offset`: Offset from the original pan event.
   *   - `velocity`: Current velocity of the pointer.
   */
  onPan?(event: PointerEvent, info: PanInfo): void;
  /**
   * Callback function that fires when the pan gesture begins on this element.
   *
   * ```jsx
   * function onPanStart(event, info) {
   *   console.log(info.point.x, info.point.y)
   * }
   *
   * <motion.div onPanStart={onPanStart} />
   * ```
   *
   * @param event - The originating pointer event.
   * @param info - A {@link PanInfo} object containing `x`/`y` values for:
   *
   *   - `point`: Relative to the device or page.
   *   - `delta`: Distance moved since the last event.
   *   - `offset`: Offset from the original pan event.
   *   - `velocity`: Current velocity of the pointer.
   */
  onPanStart?(event: PointerEvent, info: PanInfo): void;
  /**
   * Callback function that fires when we begin detecting a pan gesture. This
   * is analogous to `onMouseStart` or `onTouchStart`.
   *
   * ```jsx
   * function onPanSessionStart(event, info) {
   *   console.log(info.point.x, info.point.y)
   * }
   *
   * <motion.div onPanSessionStart={onPanSessionStart} />
   * ```
   *
   * @param event - The originating pointer event.
   * @param info - An {@link EventInfo} object containing `x`/`y` values for:
   *
   *   - `point`: Relative to the device or page.
   */
  onPanSessionStart?(event: PointerEvent, info: EventInfo): void;
  /**
   * Callback function that fires when the pan gesture ends on this element.
   *
   * ```jsx
   * function onPanEnd(event, info) {
   *   console.log(info.point.x, info.point.y)
   * }
   *
   * <motion.div onPanEnd={onPanEnd} />
   * ```
   *
   * @param event - The originating pointer event.
   * @param info - A {@link PanInfo} object containing `x`/`y` values for:
   *
   *   - `point`: Relative to the device or page.
   *   - `delta`: Distance moved since the last event.
   *   - `offset`: Offset from the original pan event.
   *   - `velocity`: Current velocity of the pointer.
   */
  onPanEnd?(event: PointerEvent, info: PanInfo): void;
}
interface MotionNodeHoverHandlers {
  /**
   * Properties or variant label to animate to while the hover gesture is recognised.
   *
   * ```jsx
   * <motion.div whileHover={{ scale: 1.2 }} />
   * ```
   */
  whileHover?: VariantLabels$1 | TargetAndTransition;
  /**
   * Callback function that fires when pointer starts hovering over the component.
   *
   * ```jsx
   * <motion.div onHoverStart={() => console.log('Hover starts')} />
   * ```
   */
  onHoverStart?(event: MouseEvent, info: EventInfo): void;
  /**
   * Callback function that fires when pointer stops hovering over the component.
   *
   * ```jsx
   * <motion.div onHoverEnd={() => console.log("Hover ends")} />
   * ```
   */
  onHoverEnd?(event: MouseEvent, info: EventInfo): void;
}
/**
 * Passed in to tap event handlers like `onTap` the `TapInfo` object contains
 * information about the tap gesture such as it‘s location.
 *
 * ```jsx
 * function onTap(event, info) {
 *   console.log(info.point.x, info.point.y)
 * }
 *
 * <motion.div onTap={onTap} />
 * ```
 *
 * @public
 */
interface TapInfo {
  /**
   * Contains `x` and `y` values for the tap gesture relative to the
   * device or page.
   *
   * ```jsx
   * function onTapStart(event, info) {
   *   console.log(info.point.x, info.point.y)
   * }
   *
   * <motion.div onTapStart={onTapStart} />
   * ```
   *
   * @public
   */
  point: Point;
}
interface MotionNodeTapHandlers {
  /**
   * Callback when the tap gesture successfully ends on this element.
   *
   * ```jsx
   * function onTap(event, info) {
   *   console.log(info.point.x, info.point.y)
   * }
   *
   * <motion.div onTap={onTap} />
   * ```
   *
   * @param event - The originating pointer event.
   * @param info - An {@link TapInfo} object containing `x` and `y` values for the `point` relative to the device or page.
   */
  onTap?(event: MouseEvent | TouchEvent | PointerEvent, info: TapInfo): void;
  /**
   * Callback when the tap gesture starts on this element.
   *
   * ```jsx
   * function onTapStart(event, info) {
   *   console.log(info.point.x, info.point.y)
   * }
   *
   * <motion.div onTapStart={onTapStart} />
   * ```
   *
   * @param event - The originating pointer event.
   * @param info - An {@link TapInfo} object containing `x` and `y` values for the `point` relative to the device or page.
   */
  onTapStart?(event: MouseEvent | TouchEvent | PointerEvent, info: TapInfo): void;
  /**
   * Callback when the tap gesture ends outside this element.
   *
   * ```jsx
   * function onTapCancel(event, info) {
   *   console.log(info.point.x, info.point.y)
   * }
   *
   * <motion.div onTapCancel={onTapCancel} />
   * ```
   *
   * @param event - The originating pointer event.
   * @param info - An {@link TapInfo} object containing `x` and `y` values for the `point` relative to the device or page.
   */
  onTapCancel?(event: MouseEvent | TouchEvent | PointerEvent, info: TapInfo): void;
  /**
   * Properties or variant label to animate to while the component is pressed.
   *
   * ```jsx
   * <motion.div whileTap={{ scale: 0.8 }} />
   * ```
   */
  whileTap?: VariantLabels$1 | TargetAndTransition;
  /**
   * If `true`, the tap gesture will attach its start listener to window.
   *
   * Note: This is not supported publically.
   */
  globalTapTarget?: boolean;
}
/**
 * @deprecated - Use MotionNodeTapHandlers
 */

interface MotionNodeFocusHandlers {
  /**
   * Properties or variant label to animate to while the focus gesture is recognised.
   *
   * ```jsx
   * <motion.input whileFocus={{ scale: 1.2 }} />
   * ```
   */
  whileFocus?: VariantLabels$1 | TargetAndTransition;
}
/**
 * TODO: Replace with types from inView()
 */
type ViewportEventHandler = (entry: IntersectionObserverEntry | null) => void;
interface ViewportOptions {
  root?: {
    current: Element | null;
  };
  once?: boolean;
  margin?: string;
  amount?: "some" | "all" | number;
}
interface MotionNodeViewportOptions {
  whileInView?: VariantLabels$1 | TargetAndTransition;
  onViewportEnter?: ViewportEventHandler;
  onViewportLeave?: ViewportEventHandler;
  viewport?: ViewportOptions;
}
interface MotionNodeDraggableOptions {
  /**
   * Enable dragging for this element. Set to `false` by default.
   * Set `true` to drag in both directions.
   * Set `"x"` or `"y"` to only drag in a specific direction.
   *
   * ```jsx
   * <motion.div drag="x" />
   * ```
   */
  drag?: boolean | "x" | "y";
  /**
   * Properties or variant label to animate to while the drag gesture is recognised.
   *
   * ```jsx
   * <motion.div whileDrag={{ scale: 1.2 }} />
   * ```
   */
  whileDrag?: VariantLabels$1 | TargetAndTransition;
  /**
   * If `true`, this will lock dragging to the initially-detected direction. Defaults to `false`.
   *
   * ```jsx
   * <motion.div drag dragDirectionLock />
   * ```
   */
  dragDirectionLock?: boolean;
  /**
   * Allows drag gesture propagation to child components. Set to `false` by
   * default.
   *
   * ```jsx
   * <motion.div drag="x" dragPropagation />
   * ```
   */
  dragPropagation?: boolean;
  /**
   * Applies constraints on the permitted draggable area.
   *
   * It can accept an object of optional `top`, `left`, `right`, and `bottom` values, measured in pixels.
   * This will define a distance from the named edge of the draggable component.
   *
   * Alternatively, it can accept a `ref` to another component created with React's `useRef` hook.
   * This `ref` should be passed both to the draggable component's `dragConstraints` prop, and the `ref`
   * of the component you want to use as constraints.
   *
   * ```jsx
   * // In pixels
   * <motion.div
   *   drag="x"
   *   dragConstraints={{ left: 0, right: 300 }}
   * />
   *
   * // As a ref to another component
   * const MyComponent = () => {
   *   const constraintsRef = useRef(null)
   *
   *   return (
   *      <motion.div ref={constraintsRef}>
   *          <motion.div drag dragConstraints={constraintsRef} />
   *      </motion.div>
   *   )
   * }
   * ```
   */
  dragConstraints?: false | Partial<BoundingBox> | {
    current: Element | null;
  };
  /**
   * The degree of movement allowed outside constraints. 0 = no movement, 1 =
   * full movement.
   *
   * Set to `0.5` by default. Can also be set as `false` to disable movement.
   *
   * By passing an object of `top`/`right`/`bottom`/`left`, individual values can be set
   * per constraint. Any missing values will be set to `0`.
   *
   * ```jsx
   * <motion.div
   *   drag
   *   dragConstraints={{ left: 0, right: 300 }}
   *   dragElastic={0.2}
   * />
   * ```
   */
  dragElastic?: DragElastic;
  /**
   * Apply momentum from the pan gesture to the component when dragging
   * finishes. Set to `true` by default.
   *
   * ```jsx
   * <motion.div
   *   drag
   *   dragConstraints={{ left: 0, right: 300 }}
   *   dragMomentum={false}
   * />
   * ```
   */
  dragMomentum?: boolean;
  /**
   * Allows you to change dragging inertia parameters.
   * When releasing a draggable Frame, an animation with type `inertia` starts. The animation is based on your dragging velocity. This property allows you to customize it.
   * See {@link https://motion.dev/docs/react-motion-component#dragtransition | Inertia} for all properties you can use.
   *
   * ```jsx
   * <motion.div
   *   drag
   *   dragTransition={{ bounceStiffness: 600, bounceDamping: 10 }}
   * />
   * ```
   */
  dragTransition?: InertiaOptions;
  /**
   * Usually, dragging is initiated by pressing down on a component and moving it. For some
   * use-cases, for instance clicking at an arbitrary point on a video scrubber, we
   * might want to initiate dragging from a different component than the draggable one.
   *
   * By creating a `dragControls` using the `useDragControls` hook, we can pass this into
   * the draggable component's `dragControls` prop. It exposes a `start` method
   * that can start dragging from pointer events on other components.
   *
   * ```jsx
   * const dragControls = useDragControls()
   *
   * function startDrag(event) {
   *   dragControls.start(event, { snapToCursor: true })
   * }
   *
   * return (
   *   <>
   *     <div onPointerDown={startDrag} />
   *     <motion.div drag="x" dragControls={dragControls} />
   *   </>
   * )
   * ```
   */
  dragControls?: any;
  /**
   * If true, element will snap back to its origin when dragging ends.
   *
   * Enabling this is the equivalent of setting all `dragConstraints` axes to `0`
   * with `dragElastic={1}`, but when used together `dragConstraints` can define
   * a wider draggable area and `dragSnapToOrigin` will ensure the element
   * animates back to its origin on release.
   */
  dragSnapToOrigin?: boolean;
  /**
   * By default, if `drag` is defined on a component then an event listener will be attached
   * to automatically initiate dragging when a user presses down on it.
   *
   * By setting `dragListener` to `false`, this event listener will not be created.
   *
   * ```jsx
   * const dragControls = useDragControls()
   *
   * function startDrag(event) {
   *   dragControls.start(event, { snapToCursor: true })
   * }
   *
   * return (
   *   <>
   *     <div onPointerDown={startDrag} />
   *     <motion.div
   *       drag="x"
   *       dragControls={dragControls}
   *       dragListener={false}
   *     />
   *   </>
   * )
   * ```
   */
  dragListener?: boolean;
  /**
   * If `dragConstraints` is set to a React ref, this callback will call with the measured drag constraints.
   *
   * @public
   */
  onMeasureDragConstraints?: (constraints: BoundingBox) => BoundingBox | void;
  /**
   * Usually, dragging uses the layout project engine, and applies transforms to the underlying VisualElement.
   * Passing MotionValues as _dragX and _dragY instead applies drag updates to these motion values.
   * This allows you to manually control how updates from a drag gesture on an element is applied.
   *
   * @public
   */
  _dragX?: MotionValue<number>;
  /**
   * Usually, dragging uses the layout project engine, and applies transforms to the underlying VisualElement.
   * Passing MotionValues as _dragX and _dragY instead applies drag updates to these motion values.
   * This allows you to manually control how updates from a drag gesture on an element is applied.
   *
   * @public
   */
  _dragY?: MotionValue<number>;
}
interface MotionNodeDragHandlers {
  /**
   * Callback function that fires when dragging starts.
   *
   * ```jsx
   * <motion.div
   *   drag
   *   onDragStart={
   *     (event, info) => console.log(info.point.x, info.point.y)
   *   }
   * />
   * ```
   *
   * @public
   */
  onDragStart?(event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo): void;
  /**
   * Callback function that fires when dragging ends.
   *
   * ```jsx
   * <motion.div
   *   drag
   *   onDragEnd={
   *     (event, info) => console.log(info.point.x, info.point.y)
   *   }
   * />
   * ```
   *
   * @public
   */
  onDragEnd?(event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo): void;
  /**
   * Callback function that fires when the component is dragged.
   *
   * ```jsx
   * <motion.div
   *   drag
   *   onDrag={
   *     (event, info) => console.log(info.point.x, info.point.y)
   *   }
   * />
   * ```
   *
   * @public
   */
  onDrag?(event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo): void;
  /**
   * Callback function that fires a drag direction is determined.
   *
   * ```jsx
   * <motion.div
   *   drag
   *   dragDirectionLock
   *   onDirectionLock={axis => console.log(axis)}
   * />
   * ```
   *
   * @public
   */
  onDirectionLock?(axis: "x" | "y"): void;
  /**
   * Callback function that fires when drag momentum/bounce transition finishes.
   *
   * ```jsx
   * <motion.div
   *   drag
   *   onDragTransitionEnd={() => console.log('Drag transition complete')}
   * />
   * ```
   *
   * @public
   */
  onDragTransitionEnd?(): void;
}
interface MotionNodeLayoutOptions {
  /**
   * If `true`, this component will automatically animate to its new position when
   * its layout changes.
   *
   * ```jsx
   * <motion.div layout />
   * ```
   *
   * This will perform a layout animation using performant transforms. Part of this technique
   * involved animating an element's scale. This can introduce visual distortions on children,
   * `boxShadow` and `borderRadius`.
   *
   * To correct distortion on immediate children, add `layout` to those too.
   *
   * `boxShadow` and `borderRadius` will automatically be corrected if they are already being
   * animated on this component. Otherwise, set them directly via the `initial` prop.
   *
   * If `layout` is set to `"position"`, the size of the component will change instantly and
   * only its position will animate.
   *
   * If `layout` is set to `"size"`, the position of the component will change instantly and
   * only its size will animate.
   *
   * If `layout` is set to `"preserve-aspect"`, the component will animate size & position if
   * the aspect ratio remains the same between renders, and just position if the ratio changes.
   *
   * @public
   */
  layout?: boolean | "position" | "size" | "preserve-aspect";
  /**
   * Enable shared layout transitions between different components with the same `layoutId`.
   *
   * When a component with a layoutId is removed from the React tree, and then
   * added elsewhere, it will visually animate from the previous component's bounding box
   * and its latest animated values.
   *
   * ```jsx
   *   {items.map(item => (
   *      <motion.li layout>
   *         {item.name}
   *         {item.isSelected && <motion.div layoutId="underline" />}
   *      </motion.li>
   *   ))}
   * ```
   *
   * If the previous component remains in the tree it will crossfade with the new component.
   *
   * @public
   */
  layoutId?: string;
  /**
   * A callback that will fire when a layout animation on this component starts.
   *
   * @public
   */
  onLayoutAnimationStart?(): void;
  /**
   * A callback that will fire when a layout animation on this component completes.
   *
   * @public
   */
  onLayoutAnimationComplete?(): void;
  /**
   * @public
   */
  layoutDependency?: any;
  /**
   * Whether a projection node should measure its scroll when it or its descendants update their layout.
   *
   * @public
   */
  layoutScroll?: boolean;
  /**
   * Whether an element should be considered a "layout root", where
   * all children will be forced to resolve relatively to it.
   * Currently used for `position: sticky` elements in Framer.
   */
  layoutRoot?: boolean;
  /**
   * Attached to a portal root to ensure we attach the child to the document root and don't
   * perform scale correction on it.
   */
  "data-framer-portal-id"?: string;
  /**
   * By default, shared layout elements will crossfade. By setting this
   * to `false`, this element will take its default opacity throughout the animation.
   */
  layoutCrossfade?: boolean;
}
/**
 * @deprecated - Use MotionNodeDragHandlers/MotionNodeDraggableOptions
 */

type TransformTemplate = (transform: TransformProperties, generatedTransform: string) => string;
interface MotionNodeAdvancedOptions {
  /**
   * Custom data to use to resolve dynamic variants differently for each animating component.
   *
   * ```jsx
   * const variants = {
   *   visible: (custom) => ({
   *     opacity: 1,
   *     transition: { delay: custom * 0.2 }
   *   })
   * }
   *
   * <motion.div custom={0} animate="visible" variants={variants} />
   * <motion.div custom={1} animate="visible" variants={variants} />
   * <motion.div custom={2} animate="visible" variants={variants} />
   * ```
   *
   * @public
   */
  custom?: any;
  /**
   * @public
   * Set to `false` to prevent inheriting variant changes from its parent.
   */
  inherit?: boolean;
  /**
   * @public
   * Set to `false` to prevent throwing an error when a `motion` component is used within a `LazyMotion` set to strict.
   */
  ignoreStrict?: boolean;
  /**
   * Provide a set of motion values to perform animations on.
   */
  values?: {
    [key: string]: MotionValue<number> | MotionValue<string>;
  };
  /**
   * By default, Motion generates a `transform` property with a sensible transform order. `transformTemplate`
   * can be used to create a different order, or to append/preprend the automatically generated `transform` property.
   *
   * ```jsx
   * <motion.div
   *   style={{ x: 0, rotate: 180 }}
   *   transformTemplate={
   *     ({ x, rotate }) => `rotate(${rotate}deg) translateX(${x}px)`
   *   }
   * />
   * ```
   *
   * @param transform - The latest animated transform props.
   * @param generatedTransform - The transform string as automatically generated by Motion
   *
   * @public
   */
  transformTemplate?: TransformTemplate;
  "data-framer-appear-id"?: string;
}
interface MotionNodeOptions extends MotionNodeAnimationOptions, MotionNodeEventOptions, MotionNodePanHandlers, MotionNodeTapHandlers, MotionNodeHoverHandlers, MotionNodeFocusHandlers, MotionNodeViewportOptions, MotionNodeDragHandlers, MotionNodeDraggableOptions, MotionNodeLayoutOptions, MotionNodeAdvancedOptions {}
declare global {
  interface Window {
    ScrollTimeline: ScrollTimeline;
  }
}
declare class ScrollTimeline implements ProgressTimeline {
  constructor(options: ScrollOptions);
  currentTime: null | {
    value: number;
  };
  cancel?: VoidFunction;
}
//#endregion
//#region ../node_modules/.pnpm/framer-motion@12.23.26_@emotion+is-prop-valid@1.4.0_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/framer-motion/dist/types.d-DagZKalS.d.ts
type MotionValueString = MotionValue<string>;
type MotionValueNumber = MotionValue<number>;
type MotionValueAny = MotionValue<any>;
type AnyMotionValue = MotionValueNumber | MotionValueString | MotionValueAny;
type MotionValueHelper<T> = T | AnyMotionValue;
type MakeMotionHelper<T> = { [K in keyof T]: MotionValueHelper<T[K]> };
type MakeCustomValueTypeHelper<T> = MakeMotionHelper<T>;
type MakeMotion<T> = MakeCustomValueTypeHelper<T>;
type MotionCSS = MakeMotion<Omit<CSSProperties, "rotate" | "scale" | "perspective">>;
/**
 * @public
 */
type MotionTransform = MakeMotion<TransformProperties>;
type MotionSVGProps = MakeMotion<SVGPathProperties>;
/**
 * @public
 */
interface MotionStyle extends MotionCSS, MotionTransform, MotionSVGProps {}
/**
 * Props for `motion` components.
 *
 * @public
 */
interface MotionProps extends MotionNodeOptions {
  /**
   *
   * The React DOM `style` prop, enhanced with support for `MotionValue`s and separate `transform` values.
   *
   * ```jsx
   * export const MyComponent = () => {
   *   const x = useMotionValue(0)
   *
   *   return <motion.div style={{ x, opacity: 1, scale: 0.5 }} />
   * }
   * ```
   */
  style?: MotionStyle;
  children?: React.ReactNode | MotionValueNumber | MotionValueString;
}
interface HTMLElements {
  a: HTMLAnchorElement;
  abbr: HTMLElement;
  address: HTMLElement;
  area: HTMLAreaElement;
  article: HTMLElement;
  aside: HTMLElement;
  audio: HTMLAudioElement;
  b: HTMLElement;
  base: HTMLBaseElement;
  bdi: HTMLElement;
  bdo: HTMLElement;
  big: HTMLElement;
  blockquote: HTMLQuoteElement;
  body: HTMLBodyElement;
  br: HTMLBRElement;
  button: HTMLButtonElement;
  canvas: HTMLCanvasElement;
  caption: HTMLElement;
  center: HTMLElement;
  cite: HTMLElement;
  code: HTMLElement;
  col: HTMLTableColElement;
  colgroup: HTMLTableColElement;
  data: HTMLDataElement;
  datalist: HTMLDataListElement;
  dd: HTMLElement;
  del: HTMLModElement;
  details: HTMLDetailsElement;
  dfn: HTMLElement;
  dialog: HTMLDialogElement;
  div: HTMLDivElement;
  dl: HTMLDListElement;
  dt: HTMLElement;
  em: HTMLElement;
  embed: HTMLEmbedElement;
  fieldset: HTMLFieldSetElement;
  figcaption: HTMLElement;
  figure: HTMLElement;
  footer: HTMLElement;
  form: HTMLFormElement;
  h1: HTMLHeadingElement;
  h2: HTMLHeadingElement;
  h3: HTMLHeadingElement;
  h4: HTMLHeadingElement;
  h5: HTMLHeadingElement;
  h6: HTMLHeadingElement;
  head: HTMLHeadElement;
  header: HTMLElement;
  hgroup: HTMLElement;
  hr: HTMLHRElement;
  html: HTMLHtmlElement;
  i: HTMLElement;
  iframe: HTMLIFrameElement;
  img: HTMLImageElement;
  input: HTMLInputElement;
  ins: HTMLModElement;
  kbd: HTMLElement;
  keygen: HTMLElement;
  label: HTMLLabelElement;
  legend: HTMLLegendElement;
  li: HTMLLIElement;
  link: HTMLLinkElement;
  main: HTMLElement;
  map: HTMLMapElement;
  mark: HTMLElement;
  menu: HTMLElement;
  menuitem: HTMLElement;
  meta: HTMLMetaElement;
  meter: HTMLMeterElement;
  nav: HTMLElement;
  noindex: HTMLElement;
  noscript: HTMLElement;
  object: HTMLObjectElement;
  ol: HTMLOListElement;
  optgroup: HTMLOptGroupElement;
  option: HTMLOptionElement;
  output: HTMLOutputElement;
  p: HTMLParagraphElement;
  param: HTMLParamElement;
  picture: HTMLElement;
  pre: HTMLPreElement;
  progress: HTMLProgressElement;
  q: HTMLQuoteElement;
  rp: HTMLElement;
  rt: HTMLElement;
  ruby: HTMLElement;
  s: HTMLElement;
  samp: HTMLElement;
  search: HTMLElement;
  slot: HTMLSlotElement;
  script: HTMLScriptElement;
  section: HTMLElement;
  select: HTMLSelectElement;
  small: HTMLElement;
  source: HTMLSourceElement;
  span: HTMLSpanElement;
  strong: HTMLElement;
  style: HTMLStyleElement;
  sub: HTMLElement;
  summary: HTMLElement;
  sup: HTMLElement;
  table: HTMLTableElement;
  template: HTMLTemplateElement;
  tbody: HTMLTableSectionElement;
  td: HTMLTableDataCellElement;
  textarea: HTMLTextAreaElement;
  tfoot: HTMLTableSectionElement;
  th: HTMLTableHeaderCellElement;
  thead: HTMLTableSectionElement;
  time: HTMLTimeElement;
  title: HTMLTitleElement;
  tr: HTMLTableRowElement;
  track: HTMLTrackElement;
  u: HTMLElement;
  ul: HTMLUListElement;
  var: HTMLElement;
  video: HTMLVideoElement;
  wbr: HTMLElement;
  webview: HTMLWebViewElement;
}
type AttributesWithoutMotionProps<Attributes> = { [K in Exclude<keyof Attributes, keyof MotionProps>]?: Attributes[K] };
/**
 * @public
 */
type HTMLMotionProps<Tag extends keyof HTMLElements> = AttributesWithoutMotionProps<JSX$1.IntrinsicElements[Tag]> & MotionProps;
/**
 * Motion-optimised versions of React's HTML components.
 *
 * @public
 */

declare const optimizedAppearDataAttribute: "data-framer-appear-id";

/**
 * Expose only the needed part of the VisualElement interface to
 * ensure React types don't end up in the generic DOM bundle.
 */
interface WithAppearProps {
  props: {
    [optimizedAppearDataAttribute]?: string;
    values?: {
      [key: string]: MotionValue<number> | MotionValue<string>;
    };
  };
}
type HandoffFunction = (storeId: string, valueName: string, frame: Batcher) => number | null;
/**
 * The window global object acts as a bridge between our inline script
 * triggering the optimized appear animations, and Motion.
 */
declare global {
  interface Window {
    MotionHandoffAnimation?: HandoffFunction;
    MotionHandoffMarkAsComplete?: (elementId: string) => void;
    MotionHandoffIsComplete?: (elementId: string) => boolean;
    MotionHasOptimisedAnimation?: (elementId?: string, valueName?: string) => boolean;
    MotionCancelOptimisedAnimation?: (elementId?: string, valueName?: string, frame?: Batcher, canResume?: boolean) => void;
    MotionCheckAppearSync?: (visualElement: WithAppearProps, valueName: string, value: MotionValue) => VoidFunction | void;
    MotionIsMounted?: boolean;
  }
}
//#endregion
export { type ClassProp as n, ClassValue$1 as r, HTMLMotionProps as t };
//# sourceMappingURL=index3.d.ts.map