/// <reference types="react" />
import { t as ClassProp } from "./index3.js";
import { CSSProperties, ComponentProps, ComponentType, JSX, ReactNode, SVGProps, useEffect } from "react";
import * as react_jsx_runtime from "react/jsx-runtime";
import { VariantProps } from "class-variance-authority";

//#region ../node_modules/.pnpm/motion-utils@12.39.0/node_modules/motion-utils/dist/index.d.ts

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
interface AxisDelta {
  translate: number;
  scale: number;
  origin: number;
  originPoint: number;
}
interface Delta {
  x: AxisDelta;
  y: AxisDelta;
}
type TransformPoint = (point: Point) => Point;
//#endregion
//#region ../node_modules/.pnpm/motion-dom@12.40.0/node_modules/motion-dom/dist/index.d.ts
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
interface ResolvedValues$1 {
  [key: string]: AnyResolvedKeyframe;
}
type AnimationDefinition = VariantLabels | TargetAndTransition | TargetResolver;
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
  transitionEnd?: ResolvedValues$1;
};
type TargetResolver = (custom: any, current: ResolvedValues$1, velocity: ResolvedValues$1) => TargetAndTransition | string;
/**
 * Either a string, or array of strings, that reference variants defined via the `variants` prop.
 * @public
 */
type VariantLabels = string | string[];
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
  initial?: TargetAndTransition | VariantLabels | boolean;
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
  animate?: TargetAndTransition | VariantLabels | boolean | LegacyAnimationControls;
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
  exit?: TargetAndTransition | VariantLabels;
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
  onUpdate?(latest: ResolvedValues$1): void;
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
  whileHover?: VariantLabels | TargetAndTransition;
  /**
   * Callback function that fires when pointer starts hovering over the component.
   *
   * ```jsx
   * <motion.div onHoverStart={() => console.log('Hover starts')} />
   * ```
   */
  onHoverStart?(event: PointerEvent, info: EventInfo): void;
  /**
   * Callback function that fires when pointer stops hovering over the component.
   *
   * ```jsx
   * <motion.div onHoverEnd={() => console.log("Hover ends")} />
   * ```
   */
  onHoverEnd?(event: PointerEvent, info: EventInfo): void;
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
  whileTap?: VariantLabels | TargetAndTransition;
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
  whileFocus?: VariantLabels | TargetAndTransition;
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
  whileInView?: VariantLabels | TargetAndTransition;
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
  whileDrag?: VariantLabels | TargetAndTransition;
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
   * If `true`, element will snap back to its origin when dragging ends.
   * Set to `"x"` or `"y"` to only snap back on a specific axis.
   *
   * Enabling this is the equivalent of setting all `dragConstraints` axes to `0`
   * with `dragElastic={1}`, but when used together `dragConstraints` can define
   * a wider draggable area and `dragSnapToOrigin` will ensure the element
   * animates back to its origin on release.
   */
  dragSnapToOrigin?: boolean | "x" | "y";
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
  layout?: boolean | "position" | "size" | "preserve-aspect" | "x" | "y";
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
   * The anchor point for relative layout projection. This defines which
   * point on the parent is used as the reference for the child's position.
   *
   * `{ x: 0, y: 0 }` (default) anchors to the top-left corner.
   * `{ x: 0.5, y: 0.5 }` anchors to the center, useful for centered layouts
   * (e.g., flexbox) to prevent drift during parent layout animations.
   * `false` disables relative projection entirely.
   */
  layoutAnchor?: {
    x: number;
    y: number;
  } | false;
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
interface PropagateOptions {
  /**
   * If `false`, this element's tap gesture will prevent any parent
   * element's tap gesture handlers (`onTap`, `onTapStart`, `whileTap`)
   * from firing. Defaults to `true`.
   */
  tap?: boolean;
}
interface MotionNodeOptions extends MotionNodeAnimationOptions, MotionNodeEventOptions, MotionNodePanHandlers, MotionNodeTapHandlers, MotionNodeHoverHandlers, MotionNodeFocusHandlers, MotionNodeViewportOptions, MotionNodeDragHandlers, MotionNodeDraggableOptions, MotionNodeLayoutOptions, MotionNodeAdvancedOptions {
  /**
   * Controls whether gesture events propagate to parent motion components.
   * By default all gestures propagate. Set individual gestures to `false`
   * to prevent parent handlers from firing.
   *
   * ```jsx
   * <motion.div onTap={onParentTap}>
   *   <motion.div onTap={onChildTap} propagate={{ tap: false }} />
   * </motion.div>
   * ```
   */
  propagate?: PropagateOptions;
}

/**
 * @public
 */
interface PresenceContextProps {
  id: string;
  isPresent: boolean;
  register: (id: string | number) => () => void;
  onExitComplete?: (id: string | number) => void;
  initial?: false | VariantLabels;
  custom?: any;
}
/**
 * @public
 */
type ReducedMotionConfig = "always" | "never" | "user";
/**
 * @public
 */
interface MotionConfigContextProps {
  /**
   * Internal, exported only for usage in Framer
   */
  transformPagePoint: TransformPoint;
  /**
   * Internal. Determines whether this is a static context ie the Framer canvas. If so,
   * it'll disable all dynamic functionality.
   */
  isStatic: boolean;
  /**
   * Defines a new default transition for the entire tree.
   *
   * @public
   */
  transition?: Transition;
  /**
   * If true, will respect the device prefersReducedMotion setting by switching
   * transform animations off.
   *
   * @public
   */
  reducedMotion?: ReducedMotionConfig;
  /**
   * A custom `nonce` attribute used when wanting to enforce a Content Security Policy (CSP).
   * For more details see:
   * https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/style-src#unsafe_inline_styles
   *
   * @public
   */
  nonce?: string;
  /**
   * If true, all animations will be skipped and values will be set instantly.
   * Useful for E2E tests and visual regression testing.
   *
   * @public
   */
  skipAnimations?: boolean;
}
interface VisualState<_Instance, RenderState> {
  latestValues: ResolvedValues$1;
  renderState: RenderState;
}
interface VisualElementOptions<Instance, RenderState = any> {
  visualState: VisualState<Instance, RenderState>;
  parent?: any;
  variantParent?: any;
  presenceContext: PresenceContextProps | null;
  props: MotionNodeOptions;
  blockInitialAnimation?: boolean;
  reducedMotionConfig?: ReducedMotionConfig;
  /**
   * If true, all animations will be skipped and values will be set instantly.
   * Useful for E2E tests and visual regression testing.
   */
  skipAnimations?: boolean;
  /**
   * Explicit override for SVG detection. When true, uses SVG rendering;
   * when false, uses HTML rendering. If undefined, auto-detects.
   */
  isSVG?: boolean;
}
interface VisualElementEventCallbacks {
  BeforeLayoutMeasure: () => void;
  LayoutMeasure: (layout: Box, prevLayout?: Box) => void;
  LayoutUpdate: (layout: Axis, prevLayout: Axis) => void;
  Update: (latest: ResolvedValues$1) => void;
  AnimationStart: (definition: AnimationDefinition) => void;
  AnimationComplete: (definition: AnimationDefinition) => void;
  LayoutAnimationStart: () => void;
  LayoutAnimationComplete: () => void;
  SetAxisTarget: () => void;
  Unmount: () => void;
}
/**
 * Animation type for variant state management
 */
type AnimationType = "animate" | "whileHover" | "whileTap" | "whileDrag" | "whileFocus" | "whileInView" | "exit";
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
interface VisualElementAnimationOptions {
  delay?: number;
  transitionOverride?: Transition;
  custom?: any;
  type?: AnimationType;
}
interface AnimationState$1 {
  animateChanges: (type?: AnimationType) => Promise<any>;
  setActive: (type: AnimationType, isActive: boolean, options?: VisualElementAnimationOptions) => Promise<any>;
  setAnimateFunction: (fn: any) => void;
  getState: () => {
    [key: string]: AnimationTypeState;
  };
  reset: () => void;
}
interface AnimationTypeState {
  isActive: boolean;
  protectedKeys: {
    [key: string]: true;
  };
  needsAnimating: {
    [key: string]: boolean;
  };
  prevResolvedValues: {
    [key: string]: any;
  };
  prevProp?: VariantLabels | TargetAndTransition;
}

/**
 * Set feature definitions for all VisualElements.
 * This should be called by the framework layer (e.g., framer-motion) during initialization.
 */

/**
 * Motion style type - a subset of CSS properties that can contain motion values
 */
type MotionStyle$1 = {
  [K: string]: AnyResolvedKeyframe | MotionValue | undefined;
};
/**
 * A VisualElement is an imperative abstraction around UI elements such as
 * HTMLElement, SVGElement, Three.Object3D etc.
 */
declare abstract class VisualElement<Instance = unknown, RenderState = unknown, Options extends {} = {}> {
  /**
   * VisualElements are arranged in trees mirroring that of the React tree.
   * Each type of VisualElement has a unique name, to detect when we're crossing
   * type boundaries within that tree.
   */
  abstract type: string;
  /**
   * An `Array.sort` compatible function that will compare two Instances and
   * compare their respective positions within the tree.
   */
  abstract sortInstanceNodePosition(a: Instance, b: Instance): number;
  /**
   * Measure the viewport-relative bounding box of the Instance.
   */
  abstract measureInstanceViewportBox(instance: Instance, props: MotionNodeOptions & Partial<MotionConfigContextProps>): Box;
  /**
   * When a value has been removed from all animation props we need to
   * pick a target to animate back to. For instance, for HTMLElements
   * we can look in the style prop.
   */
  abstract getBaseTargetFromProps(props: MotionNodeOptions, key: string): AnyResolvedKeyframe | undefined | MotionValue;
  /**
   * When we first animate to a value we need to animate it *from* a value.
   * Often this have been specified via the initial prop but it might be
   * that the value needs to be read from the Instance.
   */
  abstract readValueFromInstance(instance: Instance, key: string, options: Options): AnyResolvedKeyframe | null | undefined;
  /**
   * When a value has been removed from the VisualElement we use this to remove
   * it from the inherting class' unique render state.
   */
  abstract removeValueFromRenderState(key: string, renderState: RenderState): void;
  /**
   * Run before a React or VisualElement render, builds the latest motion
   * values into an Instance-specific format. For example, HTMLVisualElement
   * will use this step to build `style` and `var` values.
   */
  abstract build(renderState: RenderState, latestValues: ResolvedValues$1, props: MotionNodeOptions): void;
  /**
   * Apply the built values to the Instance. For example, HTMLElements will have
   * styles applied via `setProperty` and the style attribute, whereas SVGElements
   * will have values applied to attributes.
   */
  abstract renderInstance(instance: Instance, renderState: RenderState, styleProp?: MotionStyle$1, projection?: any): void;
  /**
   * This method is called when a transform property is bound to a motion value.
   * It's currently used to measure SVG elements when a new transform property is bound.
   */
  onBindTransform?(): void;
  /**
   * If the component child is provided as a motion value, handle subscriptions
   * with the renderer-specific VisualElement.
   */
  handleChildMotionValue?(): void;
  /**
   * This method takes React props and returns found MotionValues. For example, HTML
   * MotionValues will be found within the style prop, whereas for Three.js within attribute arrays.
   *
   * This isn't an abstract method as it needs calling in the constructor, but it is
   * intended to be one.
   */
  scrapeMotionValuesFromProps(_props: MotionNodeOptions, _prevProps: MotionNodeOptions, _visualElement: VisualElement): {
    [key: string]: MotionValue | AnyResolvedKeyframe;
  };
  /**
   * A reference to the current underlying Instance, e.g. a HTMLElement
   * or Three.Mesh etc.
   */
  current: Instance | null;
  /**
   * A reference to the parent VisualElement (if exists).
   */
  parent: VisualElement | undefined;
  /**
   * A set containing references to this VisualElement's children.
   */
  children: Set<VisualElement<unknown, unknown, {}>>;
  /**
   * A set containing the latest children of this VisualElement. This is flushed
   * at the start of every commit. We use it to calculate the stagger delay
   * for newly-added children.
   */
  enteringChildren?: Set<VisualElement>;
  /**
   * The depth of this VisualElement within the overall VisualElement tree.
   */
  depth: number;
  /**
   * The current render state of this VisualElement. Defined by inherting VisualElements.
   */
  renderState: RenderState;
  /**
   * An object containing the latest static values for each of this VisualElement's
   * MotionValues.
   */
  latestValues: ResolvedValues$1;
  /**
   * Determine what role this visual element should take in the variant tree.
   */
  isVariantNode: boolean;
  isControllingVariants: boolean;
  /**
   * If this component is part of the variant tree, it should track
   * any children that are also part of the tree. This is essentially
   * a shadow tree to simplify logic around how to stagger over children.
   */
  variantChildren?: Set<VisualElement>;
  /**
   * Decides whether this VisualElement should animate in reduced motion
   * mode.
   *
   * TODO: This is currently set on every individual VisualElement but feels
   * like it could be set globally.
   */
  shouldReduceMotion: boolean | null;
  /**
   * Decides whether animations should be skipped for this VisualElement.
   * Useful for E2E tests and visual regression testing.
   */
  shouldSkipAnimations: boolean;
  /**
   * Normally, if a component is controlled by a parent's variants, it can
   * rely on that ancestor to trigger animations further down the tree.
   * However, if a component is created after its parent is mounted, the parent
   * won't trigger that mount animation so the child needs to.
   *
   * TODO: This might be better replaced with a method isParentMounted
   */
  manuallyAnimateOnMount: boolean;
  /**
   * This can be set by AnimatePresence to force components that mount
   * at the same time as it to mount as if they have initial={false} set.
   */
  blockInitialAnimation: boolean;
  /**
   * A reference to this VisualElement's projection node, used in layout animations.
   */
  projection?: any;
  /**
   * A map of all motion values attached to this visual element. Motion
   * values are source of truth for any given animated value. A motion
   * value might be provided externally by the component via props.
   */
  values: Map<string, MotionValue<any>>;
  /**
   * The AnimationState, this is hydrated by the animation Feature.
   */
  animationState?: AnimationState$1;
  KeyframeResolver: typeof KeyframeResolver;
  /**
   * The options used to create this VisualElement. The Options type is defined
   * by the inheriting VisualElement and is passed straight through to the render functions.
   */
  readonly options: Options;
  /**
   * A reference to the latest props provided to the VisualElement's host React component.
   */
  props: MotionNodeOptions;
  prevProps?: MotionNodeOptions;
  presenceContext: PresenceContextProps | null;
  prevPresenceContext?: PresenceContextProps | null;
  /**
   * Cleanup functions for active features (hover/tap/exit etc)
   */
  private features;
  /**
   * A map of every subscription that binds the provided or generated
   * motion values onChange listeners to this visual element.
   */
  private valueSubscriptions;
  /**
   * A reference to the ReducedMotionConfig passed to the VisualElement's host React component.
   */
  private reducedMotionConfig;
  /**
   * A reference to the skipAnimations config passed to the VisualElement's host React component.
   */
  private skipAnimationsConfig;
  /**
   * On mount, this will be hydrated with a callback to disconnect
   * this visual element from its parent on unmount.
   */
  private removeFromVariantTree;
  /**
   * A reference to the previously-provided motion values as returned
   * from scrapeMotionValuesFromProps. We use the keys in here to determine
   * if any motion values need to be removed after props are updated.
   */
  private prevMotionValues;
  /**
   * When values are removed from all animation props we need to search
   * for a fallback value to animate to. These values are tracked in baseTarget.
   */
  private baseTarget;
  /**
   * Create an object of the values we initially animated from (if initial prop present).
   */
  private initialValues;
  /**
   * Track whether this element has been mounted before, to detect
   * remounts after Suspense unmount/remount cycles.
   */
  private hasBeenMounted;
  /**
   * An object containing a SubscriptionManager for each active event.
   */
  private events;
  /**
   * An object containing an unsubscribe function for each prop event subscription.
   * For example, every "Update" event can have multiple subscribers via
   * VisualElement.on(), but only one of those can be defined via the onUpdate prop.
   */
  private propEventSubscriptions;
  constructor({
    parent,
    props,
    presenceContext,
    reducedMotionConfig,
    skipAnimations,
    blockInitialAnimation,
    visualState
  }: VisualElementOptions<Instance, RenderState>, options?: Options);
  mount(instance: Instance): void;
  unmount(): void;
  addChild(child: VisualElement): void;
  removeChild(child: VisualElement): void;
  private bindToMotionValue;
  sortNodePosition(other: VisualElement<Instance>): number;
  updateFeatures(): void;
  notifyUpdate: () => void;
  triggerBuild(): void;
  render: () => void;
  private renderScheduledAt;
  scheduleRender: () => void;
  /**
   * Measure the current viewport box with or without transforms.
   * Only measures axis-aligned boxes, rotate and skew must be manually
   * removed with a re-render to work.
   */
  measureViewportBox(): Box;
  getStaticValue(key: string): AnyResolvedKeyframe;
  setStaticValue(key: string, value: AnyResolvedKeyframe): void;
  /**
   * Update the provided props. Ensure any newly-added motion values are
   * added to our map, old ones removed, and listeners updated.
   */
  update(props: MotionNodeOptions, presenceContext: PresenceContextProps | null): void;
  getProps(): MotionNodeOptions;
  /**
   * Returns the variant definition with a given name.
   */
  getVariant(name: string): Variant | undefined;
  /**
   * Returns the defined default transition on this component.
   */
  getDefaultTransition(): Transition | undefined;
  getTransformPagePoint(): any;
  getClosestVariantNode(): VisualElement | undefined;
  /**
   * Add a child visual element to our set of children.
   */
  addVariantChild(child: VisualElement): (() => boolean) | undefined;
  /**
   * Add a motion value and bind it to this visual element.
   */
  addValue(key: string, value: MotionValue): void;
  /**
   * Remove a motion value and unbind any active subscriptions.
   */
  removeValue(key: string): void;
  /**
   * Check whether we have a motion value for this key
   */
  hasValue(key: string): boolean;
  /**
   * Get a motion value for this key. If called with a default
   * value, we'll create one if none exists.
   */
  getValue(key: string): MotionValue | undefined;
  getValue(key: string, defaultValue: AnyResolvedKeyframe | null): MotionValue;
  /**
   * If we're trying to animate to a previously unencountered value,
   * we need to check for it in our state and as a last resort read it
   * directly from the instance (which might have performance implications).
   */
  readValue(key: string, target?: AnyResolvedKeyframe | null): any;
  /**
   * Set the base target to later animate back to. This is currently
   * only hydrated on creation and when we first read a value.
   */
  setBaseTarget(key: string, value: AnyResolvedKeyframe): void;
  /**
   * Find the base target for a value thats been removed from all animation
   * props.
   */
  getBaseTarget(key: string): ResolvedValues$1[string] | undefined | null;
  on<EventName extends keyof VisualElementEventCallbacks>(eventName: EventName, callback: VisualElementEventCallbacks[EventName]): VoidFunction;
  notify<EventName extends keyof VisualElementEventCallbacks>(eventName: EventName, ...args: any): void;
  scheduleRenderMicrotask(): void;
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
interface WithRender {
  render: () => void;
  readValue: (name: string, keyframe: any) => any;
  getValue: (name: string, defaultValue?: any) => any;
  current?: HTMLElement | SVGElement;
  measureViewportBox: () => Box;
}
type AnyResolvedKeyframe = string | number;
interface ProgressTimeline {
  currentTime: null | {
    value: number;
  };
  cancel?: VoidFunction;
}
interface TimelineWithFallback {
  timeline?: ProgressTimeline;
  rangeStart?: string;
  rangeEnd?: string;
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
interface AnimationState<V> {
  value: V;
  done: boolean;
}
interface KeyframeGenerator<V> {
  calculatedDuration: null | number;
  next: (t: number) => AnimationState<V>;
  velocity?: (t: number) => number;
  toString: () => string;
}
interface ValueAnimationOptions<V extends AnyResolvedKeyframe = number> extends ValueAnimationTransition {
  keyframes: V[];
  element?: any;
  name?: string;
  motionValue?: MotionValue<V>;
  from?: any;
  isHandoff?: boolean;
  allowFlatten?: boolean;
  finalKeyframe?: V;
}
type GeneratorFactoryFunction = (options: ValueAnimationOptions<any>) => KeyframeGenerator<any>;
interface GeneratorFactory extends GeneratorFactoryFunction {
  applyToOptions?: (options: Transition) => Transition;
}
type AnimationGeneratorName = "decay" | "spring" | "keyframes" | "tween" | "inertia";
type AnimationGeneratorType = GeneratorFactory | AnimationGeneratorName | false;
interface AnimationPlaybackLifecycles<V> {
  onUpdate?: (latest: V) => void;
  onPlay?: () => void;
  onComplete?: () => void;
  onRepeat?: () => void;
  onStop?: () => void;
}
interface ValueAnimationTransition<V = any> extends ValueTransition, AnimationPlaybackLifecycles<V> {
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
   * @default 100
   *
   * @public
   */
  stiffness?: number;
  /**
   * Strength of opposing force. If set to 0, spring will oscillate
   * indefinitely. Set to `10` by default.
   *
   * @default 10
   *
   * @public
   */
  damping?: number;
  /**
   * Mass of the moving object. Higher values will result in more lethargic
   * movement. Set to `1` by default.
   *
   * @default 1
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
  /**
   * If true, this transition will shallow-merge with its parent transition
   * instead of replacing it. Inner keys win.
   *
   * @public
   */
  inherit?: boolean;
  /**
   * If true, the animation skips straight to its final value instead of
   * tweening. Used by `MotionConfig`'s `skipAnimations` to opt entire
   * subtrees out of animation (e.g. for E2E screenshot stability).
   *
   * @public
   */
  skipAnimations?: boolean;
  /**
   * The path the element travels between its old and new x/y positions.
   * Slot in a path factory (e.g. `arc()`) to swap the default
   * straight-line interpolation for something curved.
   *
   * Can be used in keyframe animations (`transition.path`) and layout
   * animations (`transition.layout.path`), including with `useAnimate`.
   *
   * @public
   */
  path?: MotionPath;
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
type TransitionWithValueOverrides<V> = ValueAnimationTransition<V> & StyleTransitions & SVGPathTransitions & SVGForcedAttrTransitions & SVGTransitions & VariableTransitions & {
  default?: ValueTransition;
  layout?: ValueTransition;
};
type Transition<V = any> = ValueAnimationTransition<V> | TransitionWithValueOverrides<V>;
interface PathState {
  x: number;
  y: number;
  /**
   * Optional rotation in degrees. If returned, the engine will apply it
   * to the element's `rotate` value for the duration of the animation.
   */
  rotate?: number;
}
/**
 * Sampling function — returns position (and optionally rotation) at
 * progress `t` (0–1).
 */
interface PathInterpolator {
  (t: number): PathState;
}
/**
 * Returned by a path factory such as `arc()` and passed to `transition.path`.
 * Implements both the keyframe-animation hook (`animateVisualElement`) and
 * the layout-projection hook (`interpolateProjection`).
 */
interface MotionPath {
  animateVisualElement(visualElement: VisualElement, target: TargetAndTransition, transition: Transition | undefined, delay: number, animations: AnimationPlaybackControlsWithThen[]): void;
  interpolateProjection(delta: Delta): PathInterpolator | undefined;
}
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
interface MotionValueEventCallbacks<V> {
  animationStart: () => void;
  animationComplete: () => void;
  animationCancel: () => void;
  change: (latestValue: V) => void;
  destroy: () => void;
}
interface ResolvedValues {
  [key: string]: AnyResolvedKeyframe;
}
interface Owner {
  current: HTMLElement | unknown;
  getProps: () => {
    onUpdate?: (latest: ResolvedValues) => void;
    transformTemplate?: (transform: TransformProperties, generatedTransform: string) => string;
  };
}
interface AccelerateConfig {
  factory: (animation: AnimationPlaybackControlsWithThen) => VoidFunction;
  times: number[];
  keyframes: any[];
  ease?: EasingFunction | EasingFunction[];
  duration: number;
  isTransformed?: boolean;
}
interface MotionValueOptions {
  owner?: Owner;
}
/**
 * `MotionValue` is used to track the state and velocity of motion values.
 *
 * @public
 */
declare class MotionValue<V = any> {
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
   * Scroll timeline acceleration metadata. When set, VisualElement
   * can create a native WAAPI animation attached to a scroll timeline
   * instead of driving updates through JS.
   */
  accelerate?: AccelerateConfig;
  /**
   * @param init - The initiating value
   * @param config - Optional configuration options
   *
   * -  `transformer`: A function to transform incoming values with.
   */
  constructor(init: V, options?: MotionValueOptions);
  setCurrent(current: V): void;
  setPrevFrameValue(prevFrameValue?: V | undefined): void;
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
  onChange(subscription: Subscriber<V>): () => void;
  /**
   * An object containing a SubscriptionManager for each active event.
   */
  private events;
  on<EventName extends keyof MotionValueEventCallbacks<V>>(eventName: EventName, callback: MotionValueEventCallbacks<V>[EventName]): VoidFunction;
  clearListeners(): void;
  /**
   * Attaches a passive effect to the `MotionValue`.
   */
  attach(passiveEffect: PassiveEffect<V>, stopPassiveEffect: VoidFunction): void;
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
  set(v: V): void;
  setWithVelocity(prev: V, current: V, delta: number): void;
  /**
   * Set the state of the `MotionValue`, stopping any active animations,
   * effects, and resets velocity to `0`.
   */
  jump(v: V, endAnimation?: boolean): void;
  dirty(): void;
  addDependent(dependent: MotionValue): void;
  removeDependent(dependent: MotionValue): void;
  updateAndNotify: (v: V) => void;
  /**
   * Returns the latest state of `MotionValue`
   *
   * @returns - The latest state of `MotionValue`
   *
   * @public
   */
  get(): NonNullable<V>;
  /**
   * @public
   */
  getPrevious(): V | undefined;
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
type UnresolvedKeyframes<T extends AnyResolvedKeyframe> = Array<T | null>;
type ResolvedKeyframes<T extends AnyResolvedKeyframe> = Array<T>;
type OnKeyframesResolved<T extends AnyResolvedKeyframe> = (resolvedKeyframes: ResolvedKeyframes<T>, finalKeyframe: T, forced: boolean) => void;
declare class KeyframeResolver<T extends AnyResolvedKeyframe = any> {
  name?: string;
  element?: WithRender;
  finalKeyframe?: T;
  suspendedScrollY?: number;
  protected unresolvedKeyframes: UnresolvedKeyframes<AnyResolvedKeyframe>;
  private motionValue?;
  private onComplete;
  state: "pending" | "scheduled" | "complete";
  /**
   * Track whether this resolver is async. If it is, it'll be added to the
   * resolver queue and flushed in the next frame. Resolvers that aren't going
   * to trigger read/write thrashing don't need to be async.
   */
  private isAsync;
  /**
   * Track whether this resolver needs to perform a measurement
   * to resolve its keyframes.
   */
  needsMeasurement: boolean;
  constructor(unresolvedKeyframes: UnresolvedKeyframes<AnyResolvedKeyframe>, onComplete: OnKeyframesResolved<T>, name?: string, motionValue?: MotionValue<T>, element?: WithRender, isAsync?: boolean);
  scheduleResolve(): void;
  readKeyframes(): void;
  setFinalKeyframe(): void;
  measureInitialState(): void;
  renderEndStyles(): void;
  measureEndState(): void;
  complete(isForcedComplete?: boolean): void;
  cancel(): void;
  resume(): void;
}
declare const optimizedAppearDataAttribute: "data-framer-appear-id";
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
declare global {
  interface Window {
    ScrollTimeline: ScrollTimeline;
    ViewTimeline: ViewTimeline;
  }
}
declare class ScrollTimeline implements ProgressTimeline {
  constructor(options: ScrollOptions);
  currentTime: null | {
    value: number;
  };
  cancel?: VoidFunction;
}
declare class ViewTimeline implements ProgressTimeline {
  constructor(options: {
    subject: Element;
    axis?: string;
  });
  currentTime: null | {
    value: number;
  };
  cancel?: VoidFunction;
}
//#endregion
//#region ../node_modules/.pnpm/framer-motion@12.40.0_@emotion+is-prop-valid@1.4.0_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/framer-motion/dist/index.d.ts
type MotionValueString = MotionValue<string>;
type MotionValueNumber = MotionValue<number>;
type MotionValueAny = MotionValue<any>;
type AnyMotionValue = MotionValueNumber | MotionValueString | MotionValueAny;
type MotionValueHelper<T> = T | AnyMotionValue;
type MakeMotionHelper<T> = { [K in keyof T]: MotionValueHelper<T[K]> };
type MakeCustomValueTypeHelper<T> = MakeMotionHelper<T>;
type MakeMotion<T> = MakeCustomValueTypeHelper<T>;
type MotionCSS = MakeMotion<Omit<CSSProperties, "rotate" | "scale" | "perspective" | "x" | "y" | "z">>;
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

/**
 * @public
 */

type AttributesWithoutMotionProps<Attributes> = { [K in Exclude<keyof Attributes, keyof MotionProps>]?: Attributes[K] };
/**
 * @public
 */
type HTMLMotionProps<Tag extends keyof HTMLElements> = AttributesWithoutMotionProps<JSX.IntrinsicElements[Tag]> & MotionProps;
/**
 * Motion-optimised versions of React's HTML components.
 *
 * @public
 */
//#endregion
//#region ../node_modules/.pnpm/@0xsequence+design-system@3.2.0_@types+react-dom@19.2.3_@types+react@19.2.7__@types+rea_e8a70ec65c6cffc31b8056c1e4b9de13/node_modules/@0xsequence/design-system/dist/index.d.ts
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