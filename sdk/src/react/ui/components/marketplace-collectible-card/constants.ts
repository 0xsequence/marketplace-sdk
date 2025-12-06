/**
 * Constants used across card components
 */

/**
 * Default maximum length for card titles
 */
export const CARD_TITLE_MAX_LENGTH_DEFAULT = 17;

/**
 * Maximum length for card titles when an offer bell is displayed
 * Reduced to reserve space for the offer notification icon
 */
export const CARD_TITLE_MAX_LENGTH_WITH_OFFER = 15;

/**
 * Number of characters reserved for the offer bell icon in the title
 * Used internally by Card.Title for truncation calculations
 */
export const OFFER_BELL_RESERVED_CHARS = 2;
