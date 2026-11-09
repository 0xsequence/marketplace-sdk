'use client'

import { jsx } from "react/jsx-runtime";
import { DayPicker } from "react-day-picker";

//#region src/react/ui/modals/_internal/components/calendar/index.tsx
function Calendar({ ...props }) {
	const { selectedDate, setSelectedDate } = props;
	return /* @__PURE__ */ jsx(DayPicker, {
		disabled: { before: /* @__PURE__ */ new Date() },
		selected: selectedDate,
		onDayClick: setSelectedDate,
		defaultMonth: selectedDate,
		modifiersStyles: { selected: {
			color: "hsl(var(--foreground))",
			background: "hsl(var(--primary))",
			border: "none"
		} },
		styles: {
			root: {
				width: "max-content",
				margin: 0,
				color: "hsl(var(--foreground))",
				background: "hsl(var(--background))",
				border: "1px solid hsl(var(--border))",
				borderRadius: "var(--radius)",
				padding: "0.5rem",
				position: "relative"
			},
			day: {
				margin: 0,
				width: "1rem",
				height: "1rem"
			},
			day_button: {
				margin: 0,
				width: "1.8rem",
				height: "1.5rem",
				padding: 0,
				border: "none"
			}
		},
		...props
	});
}
Calendar.displayName = "Calendar";
var calendar_default = Calendar;

//#endregion
export { calendar_default as t };
//# sourceMappingURL=calendar.js.map