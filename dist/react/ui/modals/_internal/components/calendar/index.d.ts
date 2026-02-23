import React$1, { CSSProperties } from "react";
import * as react_jsx_runtime3 from "react/jsx-runtime";

//#region ../node_modules/.pnpm/react-day-picker@9.13.0_react@19.2.3/node_modules/react-day-picker/dist/esm/types/props.d.ts

/**
 * Shared handler type for `onSelect` callback when a selection mode is set.
 *
 * @example
 *   const handleSelect: OnSelectHandler<Date> = (
 *     selected,
 *     triggerDate,
 *     modifiers,
 *     e,
 *   ) => {
 *     console.log("Selected:", selected);
 *     console.log("Triggered by:", triggerDate);
 *   };
 *
 * @template T - The type of the selected item.
 * @callback OnSelectHandler
 * @param {T} selected - The selected item after the event.
 * @param {Date} triggerDate - The date when the event was triggered. This is
 *   typically the day clicked or interacted with.
 * @param {Modifiers} modifiers - The modifiers associated with the event.
 * @param {React.MouseEvent | React.KeyboardEvent} e - The event object.
 */
type OnSelectHandler<T> = (selected: T, triggerDate: Date, modifiers: Modifiers, e: React$1.MouseEvent | React$1.KeyboardEvent) => void;
/**
 * The props when the single selection is optional.
 *
 * @group DayPicker
 * @see https://daypicker.dev/docs/selection-modes#single-mode
 */
interface PropsSingle {
  mode: "single";
  required?: false | undefined;
  /** The selected date. */
  selected?: Date | undefined;
  /** Event handler when a day is selected. */
  onSelect?: OnSelectHandler<Date | undefined>;
}
//#endregion
//#region ../node_modules/.pnpm/react-day-picker@9.13.0_react@19.2.3/node_modules/react-day-picker/dist/esm/types/shared.d.ts

/**
 * Represents the modifiers that match a specific day in the calendar.
 *
 * @example
 *   const modifiers: Modifiers = {
 *     today: true, // The day is today
 *     selected: false, // The day is not selected
 *     weekend: true, // Custom modifier for weekends
 *   };
 *
 * @see https://daypicker.dev/guides/custom-modifiers
 */
type Modifiers = Record<string, boolean>;
//#endregion
//#region src/react/ui/modals/_internal/components/calendar/index.d.ts
type CalendarProps = React.PropsWithChildren<PropsSingle> & {
  selectedDate?: Date;
  setSelectedDate?: (date: Date) => void;
};
declare function Calendar({
  ...props
}: CalendarProps): react_jsx_runtime3.JSX.Element;
declare namespace Calendar {
  var displayName: string;
}
//#endregion
export { CalendarProps, Calendar as default };
//# sourceMappingURL=index.d.ts.map