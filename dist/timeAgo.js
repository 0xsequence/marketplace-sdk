'use client'

import { useEffect, useState } from "react";
import { Text } from "@0xsequence/design-system";
import { jsx } from "react/jsx-runtime";
import { formatDistanceToNow } from "date-fns";

//#region src/react/ui/modals/_internal/components/timeAgo/index.tsx
function TimeAgo({ date }) {
	const [timeAgo, setTimeAgo] = useState("");
	useEffect(() => {
		const interval = setInterval(() => {
			setTimeAgo(formatDistanceToNow(date));
		}, 1e3);
		return () => clearInterval(interval);
	}, [date]);
	return /* @__PURE__ */ jsx("div", {
		className: "flex grow items-center justify-end",
		children: /* @__PURE__ */ jsx(Text, {
			className: "text-sm",
			color: "text50",
			children: timeAgo
		})
	});
}

//#endregion
export { TimeAgo as t };
//# sourceMappingURL=timeAgo.js.map