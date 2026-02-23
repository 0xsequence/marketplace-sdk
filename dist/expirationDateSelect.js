'use client'

import { l as cn$1 } from "./utils.js";
import { m as clamp } from "./api.js";
import { t as calendar_default } from "./calendar.js";
import { useRef, useState } from "react";
import { Button, CalendarIcon, DropdownMenu, DropdownMenuContent, DropdownMenuPortal, DropdownMenuTrigger, NumericInput, Skeleton, Text, TimeIcon } from "@0xsequence/design-system";
import { jsx, jsxs } from "react/jsx-runtime";
import { addDays, differenceInDays, endOfDay, format, getHours, getMinutes, isSameDay, setHours, setMinutes, startOfDay } from "date-fns";

//#region src/react/ui/modals/_internal/components/calendarDropdown/TimeSelector.tsx
function TimeSelector({ selectedDate, onTimeChange }) {
	const minutesRef = useRef(null);
	const [draft, setDraft] = useState(null);
	const currentHours = getHours(selectedDate);
	const currentMinutes = getMinutes(selectedDate);
	const commitChange = () => {
		if (!draft) return;
		const now = /* @__PURE__ */ new Date();
		const parse = (val, fallback) => {
			const n = Number.parseInt(val, 10);
			return Number.isNaN(n) ? fallback : n;
		};
		let h = clamp(parse(draft.hours, currentHours), 0, 23);
		let m = clamp(parse(draft.minutes, currentMinutes), 0, 59);
		if (setMinutes(setHours(selectedDate, h), m) < now) {
			h = getHours(now);
			m = getMinutes(now);
		}
		onTimeChange(h, m);
		setDraft(null);
	};
	const handleKeyDown = (e, field) => {
		if (e.key === "Enter") {
			e.preventDefault();
			if (field === "hours") minutesRef.current?.focus();
			else commitChange();
		} else if (e.key === "Escape") {
			e.preventDefault();
			setDraft(null);
			e.currentTarget.blur();
		}
	};
	const hours = draft?.hours ?? currentHours.toString().padStart(2, "0");
	const minutes = draft?.minutes ?? currentMinutes.toString().padStart(2, "0");
	return /* @__PURE__ */ jsxs("div", {
		className: "mt-3 flex items-center gap-6 border-border-base border-t pt-3",
		children: [/* @__PURE__ */ jsx(TimeIcon, {
			color: "white",
			size: "xs"
		}), /* @__PURE__ */ jsxs("div", {
			className: "flex flex-1 items-center justify-between gap-2",
			children: [
				/* @__PURE__ */ jsx("div", {
					className: "w-16 [&>label]:w-16",
					children: /* @__PURE__ */ jsx(NumericInput, {
						className: "h-9 [&>input]:text-xs",
						name: "hours",
						value: hours,
						onChange: (e) => setDraft({
							hours: e.target.value,
							minutes
						}),
						onBlur: commitChange,
						onKeyDown: (e) => handleKeyDown(e, "hours"),
						min: 0,
						max: 23,
						tabIndex: 0
					})
				}),
				/* @__PURE__ */ jsx(Text, {
					className: "font-medium text-sm text-text-80",
					children: ":"
				}),
				/* @__PURE__ */ jsx("div", {
					className: "w-16 [&>label]:w-16",
					children: /* @__PURE__ */ jsx(NumericInput, {
						ref: minutesRef,
						className: "h-9 [&>input]:text-xs",
						name: "minutes",
						value: minutes,
						onChange: (e) => setDraft({
							hours,
							minutes: e.target.value
						}),
						onBlur: commitChange,
						onKeyDown: (e) => handleKeyDown(e, "minutes"),
						min: 0,
						max: 59,
						tabIndex: 0
					})
				})
			]
		})]
	});
}

//#endregion
//#region src/react/ui/modals/_internal/components/calendarDropdown/index.tsx
/**
* Determines if the selected date matches a preset range
*/
function getMatchingPreset(selectedDate) {
	const today = startOfDay(/* @__PURE__ */ new Date());
	const selectedDay = startOfDay(selectedDate);
	const daysDifference = differenceInDays(selectedDay, today);
	if (isSameDay(selectedDay, today)) return PRESET_RANGES.TODAY.value;
	if (daysDifference === 1) return PRESET_RANGES.TOMORROW.value;
	if (daysDifference === 3) return PRESET_RANGES.IN_3_DAYS.value;
	if (daysDifference === 7) return PRESET_RANGES.ONE_WEEK.value;
	if (daysDifference === 30) return PRESET_RANGES.ONE_MONTH.value;
	return null;
}
function CalendarDropdown({ selectedDate, setSelectedDate, onSelectPreset, isOpen, setIsOpen }) {
	const matchingPreset = getMatchingPreset(selectedDate);
	const handleTimeChange = (hours, minutes) => {
		const newDate = new Date(selectedDate);
		newDate.setHours(hours, minutes, 0, 0);
		setSelectedDate(newDate);
	};
	return /* @__PURE__ */ jsxs(DropdownMenu, {
		open: isOpen,
		onOpenChange: setIsOpen,
		children: [/* @__PURE__ */ jsx(DropdownMenuTrigger, {
			asChild: true,
			children: /* @__PURE__ */ jsxs(Button, {
				className: cn$1("h-9 flex-1 rounded-sm border-border-normal p-2 font-medium text-xs", isOpen && "border-border-focus outline-1 outline-border-focus"),
				variant: "outline",
				shape: "square",
				onClick: () => setIsOpen(!isOpen),
				children: [/* @__PURE__ */ jsx(CalendarIcon, { size: "xs" }), format(selectedDate, "yyyy/MM/dd HH:mm")]
			})
		}), /* @__PURE__ */ jsx(DropdownMenuPortal, { children: /* @__PURE__ */ jsx(DropdownMenuContent, {
			className: "pointer-events-auto z-20 w-full rounded-xl border border-border-base bg-surface-neutral p-3",
			sideOffset: 5,
			children: /* @__PURE__ */ jsxs("div", {
				className: "flex gap-8",
				children: [/* @__PURE__ */ jsx("div", {
					className: "flex flex-col",
					children: Object.values(PRESET_RANGES).map((preset) => {
						return /* @__PURE__ */ jsx(Button, {
							onClick: () => {
								onSelectPreset(preset.value);
								setIsOpen(false);
							},
							variant: "text",
							className: `w-full justify-start py-1.5 font-bold text-xs transition-colors ${matchingPreset === preset.value ? "text-text-100" : "text-text-50 hover:text-text-80"}`,
							tabIndex: 0,
							children: preset.label
						}, preset.value);
					})
				}), /* @__PURE__ */ jsxs("div", {
					className: "flex flex-col",
					children: [/* @__PURE__ */ jsx(calendar_default, {
						selectedDate,
						setSelectedDate: (date) => {
							const newDate = new Date(date);
							const today = startOfDay(/* @__PURE__ */ new Date());
							if (isSameDay(startOfDay(newDate), today)) setSelectedDate(endOfDay(newDate));
							else {
								newDate.setHours(selectedDate.getHours(), selectedDate.getMinutes(), 0, 0);
								setSelectedDate(newDate);
							}
						},
						mode: "single"
					}), /* @__PURE__ */ jsx(TimeSelector, {
						selectedDate,
						onTimeChange: handleTimeChange
					})]
				})]
			})
		}) })]
	});
}

//#endregion
//#region src/react/ui/modals/_internal/components/expirationDateSelect/index.tsx
const PRESET_RANGES = {
	TODAY: {
		label: "Today",
		value: "today",
		offset: 0
	},
	TOMORROW: {
		label: "Tomorrow",
		value: "tomorrow",
		offset: 1
	},
	IN_3_DAYS: {
		label: "In 3 days",
		value: "3_days",
		offset: 3
	},
	ONE_WEEK: {
		label: "1 week",
		value: "1_week",
		offset: 7
	},
	ONE_MONTH: {
		label: "1 month",
		value: "1_month",
		offset: 30
	}
};
const ExpirationDateSelect = function ExpirationDateSelect$1({ className, date, onDateChange, disabled }) {
	const [calendarDropdownOpen, setCalendarDropdownOpen] = useState(false);
	function handleSelectPresetRange(range) {
		const presetRange = Object.values(PRESET_RANGES).find((preset) => preset.value === range);
		if (!presetRange) return;
		const baseDate = /* @__PURE__ */ new Date();
		const targetDate = presetRange.value === "today" ? baseDate : addDays(baseDate, presetRange.offset);
		onDateChange(presetRange.value === "today" ? endOfDay(targetDate) : (() => {
			const preservedTimeDate = new Date(targetDate);
			preservedTimeDate.setHours(date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds());
			return preservedTimeDate;
		})());
	}
	function handleDateValueChange(date$1) {
		onDateChange(date$1);
	}
	if (!date) return /* @__PURE__ */ jsx(Skeleton, { className: "mr-3 h-7 w-20 rounded-2xl" });
	return /* @__PURE__ */ jsxs("div", {
		className: cn$1("relative w-full", disabled && "pointer-events-none opacity-50"),
		children: [/* @__PURE__ */ jsx(Text, {
			className: "w-full text-left font-body font-medium text-xs",
			fontWeight: "medium",
			color: "text100",
			children: "Set expiry"
		}), /* @__PURE__ */ jsx("div", {
			className: `${className} flex w-full items-center gap-2 rounded-sm bg-zinc-950`,
			children: /* @__PURE__ */ jsx(CalendarDropdown, {
				selectedDate: date,
				setSelectedDate: handleDateValueChange,
				onSelectPreset: handleSelectPresetRange,
				isOpen: calendarDropdownOpen,
				setIsOpen: setCalendarDropdownOpen
			})
		})]
	});
};
var expirationDateSelect_default = ExpirationDateSelect;

//#endregion
export { expirationDateSelect_default as n, CalendarDropdown as r, PRESET_RANGES as t };
//# sourceMappingURL=expirationDateSelect.js.map