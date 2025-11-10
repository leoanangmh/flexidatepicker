/**
 * Defines a date range with a start and end date string (YYYY-MM-DD).
 */
export interface FlexiDatepickerRange {
  start: string;
  end: string;
}

/**
* Defines a disabled date range.
*/
export interface FlexiDatepickerDisabledDateRange {
  from: string;
  to: string;
}

/**
* A disabled date can be a single date string (YYYY-MM-DD) or a range object.
*/
export type FlexiDatepickerDisabledDate = string | FlexiDatepickerDisabledDateRange;

/**
* The selection mode for the date picker.
*/
export type FlexiDatepickerMode = "single" | "multiple" | "range" | "multi-range";

/**
* Represents the current selection state.
*/
export interface FlexiDatepickerSelection {
  /** An array of selected date ranges. */
  ranges: FlexiDatepickerRange[];
  /** An array of individually selected dates (for 'multiple' mode). */
  dates: string[];
}

/**
* Configuration options for the FlexiDatepicker instance.
*/
export interface FlexiDatepickerOptions {
  /**
   * The selection mode.
   * @default "multi-range"
   */
  mode?: FlexiDatepickerMode;
  /**
   * Whether to show the "Clear All Selections" button.
   * @default true
   */
  showClearAll?: boolean;
  /**
   * The date format string to display in the input.
   * Supports: dd, d, MMMM, MMM, MM, M, yyyy, yy
   * @default "MMM d, yyyy"
   */
  dateFormat?: string;
  /**
   * The locale to use for formatting month and day names.
   * @default "en-US"
   */
  locale?: string;
  /**
   * A CSS selector for an element to display the selected dates/ranges.
   * @default ""
   */
  selectedDatesDisplaySelector?: string;
  /**
   * Whether to show the "Select Weekdays" button (in 'multiple'/'multi-range' mode).
   * @default true
   */
  showSelectWeekdays?: boolean;
  /**
   * Whether to show the "Select Weekends" button (in 'multiple'/'multi-range' mode).
   * @default true
   */
  showSelectWeekends?: boolean;
  /**
   * Whether to show the "Select All Days" button (in 'multiple'/'multi-range' mode).
   * @default true
   */
  showSelectAllDays?: boolean;
  /**
   * An array of dates or date ranges to disable.
   * Dates should be in "YYYY-MM-DD" format.
   * @default []
   */
  disabledDates?: FlexiDatepickerDisabledDate[];
  /**
   * If true, all dates before today are disabled.
   * @default false
   */
  disablePast?: boolean;
  /**
   * If true, all dates after today are disabled.
   * @default false
   */
  disableFuture?: boolean;
  /**
   * The minimum selectable date ("YYYY-MM-DD").
   * @default null
   */
  minDate?: string | null;
  /**
   * The maximum selectable date ("YYYY-MM-DD").
   * @default null
   */
  maxDate?: string | null;
  /**
   * If true, displays two calendars side-by-side.
   * @default false
   */
  dualCalendar?: boolean;
  /**
   * A callback function triggered when the selection changes.
   */
  onSelectionChange?: (selection: FlexiDatepickerSelection) => void;
}

/**
* A lightweight, dependency-free JavaScript date picker supporting single, multiple, range, and multi-range selection modes.
*/
export default class FlexiDatepicker {
  /**
   * Creates a new FlexiDatepicker instance.
   * @param inputSelector A CSS selector for the input element to attach the date picker to.
   * @param options Configuration options for the date picker.
   */
  constructor(inputSelector: string, options?: FlexiDatepickerOptions);

  /** The attached input element. */
  readonly inputElement: HTMLInputElement | null;

  /** The main date picker container element. */
  readonly datepickerElement: HTMLElement;

  /** The merged options for the instance. */
  readonly options: FlexiDatepickerOptions;

  /** The currently selected display element, if any. */
  readonly selectedDisplay: HTMLElement | null;

  /** The current date used for the first calendar's display. */
  currentDate: Date;

  /** The current date used for the second calendar's display (in dual-calendar mode). */
  currentDate2: Date;

  /** An array of selected date ranges. */
  ranges: FlexiDatepickerRange[];

  /** An array of individually selected dates (used in 'multiple' mode). */
  selectedDates: string[];

  /** The start date of a range currently being selected. */
  currentRangeStart: string | null;

  /**
   * Shows the date picker.
   */
  show(): void;

  /**
   * Hides the date picker.
   */
  hide(): void;

  /**
   * Re-renders the calendar UI. Useful if options or dates are changed programmatically.
   */
  renderCalendar(): void;

  /**
   * Clears all selected dates and ranges.
   */
  handleClearAll(): void;

  /**
   * Updates the input element's value and the external display (if configured).
   * Also fires the onSelectionChange callback.
   */
  updateSelectedDisplay(): void;

  /**
   * Formats a date string according to the `dateFormat` option.
   * @param dateString The date string to format (YYYY-MM-DD).
   * @param showYear An internal flag (prefer `dateFormat` option).
   */
  formatDate(dateString: string, showYear?: boolean): string;

  /**
   * Formats a Date object according to a custom format string.
   * @param date The Date object to format.
   * @param format The format string (e.g., "yyyy-MM-dd").
   */
  formatCustomDate(date: Date, format: string): string;

  /**
   * Returns a new date string (YYYY-MM-DD) by adding a number of days to a given date string.
   * @param dateString The start date string (YYYY-MM-DD).
   * @param days The number of days to add (can be negative).
   */
  addDay(dateString: string, days: number): string;

  /**
   * Checks if a given date string is part of any selected range.
   * @param dateString The date string to check (YYYY-MM-DD).
   */
  isDateInRange(dateString: string): boolean;

  /**
   * Checks if a given Date object is disabled according to the current options.
   * @param date The Date object to check.
   */
  isDateDisabled(date: Date): boolean;

  /**
   * Merges overlapping and adjacent ranges in the `this.ranges` array.
   */
  simplifyRanges(): void;

  /**
   * Adds an array of new ranges to the selection and simplifies the result.
   * @param newRanges An array of range objects to add.
   */
  addRanges(newRanges: FlexiDatepickerRange[]): void;
}