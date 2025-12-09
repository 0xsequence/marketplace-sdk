import * as react_jsx_runtime4 from "react/jsx-runtime";
import { PropsSingle } from "react-day-picker";

//#region src/react/ui/modals/_internal/components/calendar/index.d.ts
type CalendarProps = React.PropsWithChildren<PropsSingle> & {
  selectedDate?: Date;
  setSelectedDate?: (date: Date) => void;
};
declare function Calendar({
  ...props
}: CalendarProps): react_jsx_runtime4.JSX.Element;
declare namespace Calendar {
  var displayName: string;
}
//#endregion
export { CalendarProps, Calendar as default };
//# sourceMappingURL=index.d.ts.map