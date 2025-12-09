import * as react_jsx_runtime8 from "react/jsx-runtime";

//#region src/react/ui/modals/_internal/components/expirationDateSelect/index.d.ts
declare const PRESET_RANGES: {
  readonly TODAY: {
    readonly label: "Today";
    readonly value: "today";
    readonly offset: 0;
  };
  readonly TOMORROW: {
    readonly label: "Tomorrow";
    readonly value: "tomorrow";
    readonly offset: 1;
  };
  readonly IN_3_DAYS: {
    readonly label: "In 3 days";
    readonly value: "3_days";
    readonly offset: 3;
  };
  readonly ONE_WEEK: {
    readonly label: "1 week";
    readonly value: "1_week";
    readonly offset: 7;
  };
  readonly ONE_MONTH: {
    readonly label: "1 month";
    readonly value: "1_month";
    readonly offset: 30;
  };
};
type RangeType = (typeof PRESET_RANGES)[keyof typeof PRESET_RANGES]['value'];
type ExpirationDateSelectProps = {
  className?: string;
  date: Date;
  onDateChange: (date: Date) => void;
  disabled?: boolean;
};
declare const ExpirationDateSelect: ({
  className,
  date,
  onDateChange,
  disabled
}: ExpirationDateSelectProps) => react_jsx_runtime8.JSX.Element;
//#endregion
export { PRESET_RANGES as n, RangeType as r, ExpirationDateSelect as t };
//# sourceMappingURL=index39.d.ts.map