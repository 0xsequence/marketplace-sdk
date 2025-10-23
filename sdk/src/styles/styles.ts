export const styles = String.raw`/* Modified Tailwind CSS, to avoid issues with shadow DOM, see Marketplace SDK - compile-tailwind.js and postcss.config.mjs */
:root, :host {
  --tw-animation-delay: 0s;
  --tw-animation-direction: normal;
  --tw-animation-fill-mode: none;
  --tw-animation-iteration-count: 1;
  --tw-enter-blur: 0;
  --tw-enter-opacity: 1;
  --tw-enter-rotate: 0;
  --tw-enter-scale: 1;
  --tw-enter-translate-x: 0;
  --tw-enter-translate-y: 0;
  --tw-exit-blur: 0;
  --tw-exit-opacity: 1;
  --tw-exit-rotate: 0;
  --tw-exit-scale: 1;
  --tw-exit-translate-x: 0;
  --tw-exit-translate-y: 0;
  --tw-translate-x: 0;
  --tw-translate-y: 0;
  --tw-translate-z: 0;
  --tw-space-y-reverse: 0;
  --tw-border-style: solid;
  --tw-shadow: 0 0 #0000;
  --tw-shadow-alpha: 100%;
  --tw-inset-shadow: 0 0 #0000;
  --tw-inset-shadow-alpha: 100%;
  --tw-ring-shadow: 0 0 #0000;
  --tw-inset-ring-shadow: 0 0 #0000;
  --tw-ring-offset-width: 0px;
  --tw-ring-offset-color: #fff;
  --tw-ring-offset-shadow: 0 0 #0000;
  --tw-outline-style: solid;
  --tw-drop-shadow-alpha: 100%;
  --tw-scale-x: 1;
  --tw-scale-y: 1;
  --tw-scale-z: 1;
  --tw-content: "";
  --tw-gradient-from: #0000;
  --tw-gradient-via: #0000;
  --tw-gradient-to: #0000;
  --tw-gradient-from-position: 0%;
  --tw-gradient-via-position: 50%;
  --tw-gradient-to-position: 100%;
}
/*! tailwindcss v4.1.13 | MIT License | https://tailwindcss.com */
@layer properties;
@layer theme, base, components, utilities;
@layer theme {
  :root, :host {
    --font-sans: ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji",
      "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
    --color-red-100: oklch(93.6% 0.032 17.717);
    --color-red-300: oklch(80.8% 0.114 19.571);
    --color-red-400: oklch(70.4% 0.191 22.216);
    --color-red-500: oklch(63.7% 0.237 25.331);
    --color-red-600: oklch(57.7% 0.245 27.325);
    --color-red-900: oklch(39.6% 0.141 25.723);
    --color-red-950: oklch(25.8% 0.092 26.042);
    --color-yellow-500: oklch(79.5% 0.184 86.047);
    --color-yellow-600: oklch(68.1% 0.162 75.834);
    --color-green-500: oklch(72.3% 0.219 149.579);
    --color-green-600: oklch(62.7% 0.194 149.214);
    --color-blue-500: oklch(62.3% 0.214 259.815);
    --color-blue-600: oklch(54.6% 0.245 262.881);
    --color-indigo-400: oklch(67.3% 0.182 276.935);
    --color-violet-400: oklch(70.2% 0.183 293.541);
    --color-violet-500: oklch(60.6% 0.25 292.717);
    --color-violet-600: oklch(54.1% 0.281 293.009);
    --color-violet-700: oklch(49.1% 0.27 292.581);
    --color-slate-50: oklch(98.4% 0.003 247.858);
    --color-slate-100: oklch(96.8% 0.007 247.896);
    --color-slate-200: oklch(92.9% 0.013 255.508);
    --color-slate-300: oklch(86.9% 0.022 252.894);
    --color-slate-400: oklch(70.4% 0.04 256.788);
    --color-slate-500: oklch(55.4% 0.046 257.417);
    --color-slate-800: oklch(27.9% 0.041 260.031);
    --color-slate-950: oklch(12.9% 0.042 264.695);
    --color-gray-500: oklch(55.1% 0.027 264.364);
    --color-zinc-500: oklch(55.2% 0.016 285.938);
    --color-zinc-600: oklch(44.2% 0.017 285.786);
    --color-zinc-700: oklch(37% 0.013 285.805);
    --color-zinc-800: oklch(27.4% 0.006 286.033);
    --color-zinc-900: oklch(21% 0.006 285.885);
    --color-zinc-950: oklch(14.1% 0.005 285.823);
    --color-black: #000;
    --color-white: #fff;
    --spacing: 0.25rem;
    --container-sm: 24rem;
    --container-lg: 32rem;
    --text-xs: 0.75rem;
    --text-xs--line-height: 1rem;
    --text-sm: 0.875rem;
    --text-sm--line-height: 1.25rem;
    --text-base: 1rem;
    --text-base--line-height: 1.5rem;
    --text-lg: 1.125rem;
    --text-lg--line-height: 1.75rem;
    --text-xl: 1.25rem;
    --text-xl--line-height: calc(1.75 / 1.25);
    --text-2xl: 1.5rem;
    --text-2xl--line-height: calc(2 / 1.5);
    --text-4xl: 2.25rem;
    --text-4xl--line-height: calc(2.5 / 2.25);
    --text-6xl: 3.75rem;
    --text-6xl--line-height: 1;
    --font-weight-normal: 400;
    --font-weight-medium: 500;
    --font-weight-semibold: 600;
    --font-weight-bold: 700;
    --tracking-normal: 0em;
    --tracking-wide: 0.025em;
    --tracking-widest: 0.1em;
    --leading-snug: 1.375;
    --radius-xs: 0.125rem;
    --radius-sm: 0.25rem;
    --radius-md: 0.375rem;
    --radius-lg: 0.5rem;
    --radius-xl: 0.75rem;
    --radius-2xl: 1rem;
    --ease-out: cubic-bezier(0, 0, 0.2, 1);
    --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
    --animate-spin: spin 1s linear infinite;
    --blur-xs: 4px;
    --blur-md: 12px;
    --aspect-video: 16 / 9;
    --default-transition-duration: 150ms;
    --default-transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    --default-font-family: var(--font-sans);
    --default-mono-font-family: "Roboto", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
    --font-body: "Inter", ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
    --color-border-hover: hsla(247, 100%, 75%, 0.8);
    --color-border-focus: hsla(247, 100%, 75%, 1);
    --color-border-base: hsla(0, 0%, 31%, 1);
    --color-overlay-light: hsla(0, 0%, 100%, 0.1);
    --color-overlay-glass: hsla(0, 0%, 100%, 0.05);
    --color-surface-neutral: hsla(0, 0%, 15%, 1);
    --color-text-50: hsla(0, 0%, 100%, 0.5);
    --color-text-80: hsla(0, 0%, 100%, 0.8);
    --color-text-100: hsla(0, 0%, 100%, 1);
    --spacing-card-width: clamp(175px, 100%, 280px);
    --scale-hover: 1.165;
    --animate-shimmer: shimmer 1.5s infinite;
    --animate-bell-ring: bellRing 0.4s ease-in-out;
  }
}
@layer base {
  *, ::after, ::before, ::backdrop, ::file-selector-button {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    border: 0 solid;
  }
  html, :host {
    line-height: 1.5;
    -webkit-text-size-adjust: 100%;
    tab-size: 4;
    font-family: var(--default-font-family, ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji");
    font-feature-settings: var(--default-font-feature-settings, normal);
    font-variation-settings: var(--default-font-variation-settings, normal);
    -webkit-tap-highlight-color: transparent;
  }
  hr {
    height: 0;
    color: inherit;
    border-top-width: 1px;
  }
  abbr:where([title]) {
    -webkit-text-decoration: underline dotted;
    text-decoration: underline dotted;
  }
  h1, h2, h3, h4, h5, h6 {
    font-size: inherit;
    font-weight: inherit;
  }
  a {
    color: inherit;
    -webkit-text-decoration: inherit;
    text-decoration: inherit;
  }
  b, strong {
    font-weight: bolder;
  }
  code, kbd, samp, pre {
    font-family: var(--default-mono-font-family, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace);
    font-feature-settings: var(--default-mono-font-feature-settings, normal);
    font-variation-settings: var(--default-mono-font-variation-settings, normal);
    font-size: 1em;
  }
  small {
    font-size: 80%;
  }
  sub, sup {
    font-size: 75%;
    line-height: 0;
    position: relative;
    vertical-align: baseline;
  }
  sub {
    bottom: -0.25em;
  }
  sup {
    top: -0.5em;
  }
  table {
    text-indent: 0;
    border-color: inherit;
    border-collapse: collapse;
  }
  :-moz-focusring {
    outline: auto;
  }
  progress {
    vertical-align: baseline;
  }
  summary {
    display: list-item;
  }
  ol, ul, menu {
    list-style: none;
  }
  img, svg, video, canvas, audio, iframe, embed, object {
    display: block;
    vertical-align: middle;
  }
  img, video {
    max-width: 100%;
    height: auto;
  }
  button, input, select, optgroup, textarea, ::file-selector-button {
    font: inherit;
    font-feature-settings: inherit;
    font-variation-settings: inherit;
    letter-spacing: inherit;
    color: inherit;
    border-radius: 0;
    background-color: transparent;
    opacity: 1;
  }
  :where(select:is([multiple], [size])) optgroup {
    font-weight: bolder;
  }
  :where(select:is([multiple], [size])) optgroup option {
    padding-inline-start: 20px;
  }
  ::file-selector-button {
    margin-inline-end: 4px;
  }
  ::placeholder {
    opacity: 1;
  }
  @supports (not (-webkit-appearance: -apple-pay-button))  or (contain-intrinsic-size: 1px) {
    ::placeholder {
      color: currentcolor;
      @supports (color: color-mix(in lab, red, red)) {
        color: color-mix(in oklab, currentcolor 50%, transparent);
      }
    }
  }
  textarea {
    resize: vertical;
  }
  ::-webkit-search-decoration {
    -webkit-appearance: none;
  }
  ::-webkit-date-and-time-value {
    min-height: 1lh;
    text-align: inherit;
  }
  ::-webkit-datetime-edit {
    display: inline-flex;
  }
  ::-webkit-datetime-edit-fields-wrapper {
    padding: 0;
  }
  ::-webkit-datetime-edit, ::-webkit-datetime-edit-year-field, ::-webkit-datetime-edit-month-field, ::-webkit-datetime-edit-day-field, ::-webkit-datetime-edit-hour-field, ::-webkit-datetime-edit-minute-field, ::-webkit-datetime-edit-second-field, ::-webkit-datetime-edit-millisecond-field, ::-webkit-datetime-edit-meridiem-field {
    padding-block: 0;
  }
  ::-webkit-calendar-picker-indicator {
    line-height: 1;
  }
  :-moz-ui-invalid {
    box-shadow: none;
  }
  button, input:where([type="button"], [type="reset"], [type="submit"]), ::file-selector-button {
    appearance: button;
  }
  ::-webkit-inner-spin-button, ::-webkit-outer-spin-button {
    height: auto;
  }
  [hidden]:where(:not([hidden="until-found"])) {
    display: none !important;
  }
}
@layer utilities {
  .\@container\/field-group {
    container-type: inline-size;
    container-name: field-group;
  }
  .\@container {
    container-type: inline-size;
  }
  .pointer-events-auto {
    pointer-events: auto;
  }
  .pointer-events-none {
    pointer-events: none;
  }
  .invisible {
    visibility: hidden;
  }
  .visible {
    visibility: visible;
  }
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
    border-width: 0;
  }
  .absolute {
    position: absolute;
  }
  .fixed {
    position: fixed;
  }
  .relative {
    position: relative;
  }
  .static {
    position: static;
  }
  .sticky {
    position: sticky;
  }
  .inset-0 {
    inset: calc(var(--spacing) * 0);
  }
  .inset-2 {
    inset: calc(var(--spacing) * 2);
  }
  .inset-x-0 {
    inset-inline: calc(var(--spacing) * 0);
  }
  .inset-y-0 {
    inset-block: calc(var(--spacing) * 0);
  }
  .top-0 {
    top: calc(var(--spacing) * 0);
  }
  .top-1 {
    top: calc(var(--spacing) * 1);
  }
  .top-1\/2 {
    top: calc(1/2 * 100%);
  }
  .top-4 {
    top: calc(var(--spacing) * 4);
  }
  .top-8 {
    top: calc(var(--spacing) * 8);
  }
  .top-\[50\%\] {
    top: 50%;
  }
  .right-0 {
    right: calc(var(--spacing) * 0);
  }
  .right-4 {
    right: calc(var(--spacing) * 4);
  }
  .-bottom-5 {
    bottom: calc(var(--spacing) * -5);
  }
  .-bottom-16 {
    bottom: calc(var(--spacing) * -16);
  }
  .bottom-0 {
    bottom: calc(var(--spacing) * 0);
  }
  .left-0 {
    left: calc(var(--spacing) * 0);
  }
  .left-2 {
    left: calc(var(--spacing) * 2);
  }
  .left-4 {
    left: calc(var(--spacing) * 4);
  }
  .left-\[50\%\] {
    left: 50%;
  }
  .z-1 {
    z-index: 1;
  }
  .z-2 {
    z-index: 2;
  }
  .z-10 {
    z-index: 10;
  }
  .z-20 {
    z-index: 20;
  }
  .z-30 {
    z-index: 30;
  }
  .z-50 {
    z-index: 50;
  }
  .z-1000 {
    z-index: 1000;
  }
  .z-\[1000\] {
    z-index: 1000;
  }
  .order-123 {
    order: 123;
  }
  .order-456 {
    order: 456;
  }
  .order-first {
    order: -9999;
  }
  .order-last {
    order: 9999;
  }
  .container {
    width: 100%;
    @media (width >= 40rem) {
      max-width: 40rem;
    }
    @media (width >= 48rem) {
      max-width: 48rem;
    }
    @media (width >= 64rem) {
      max-width: 64rem;
    }
    @media (width >= 80rem) {
      max-width: 80rem;
    }
    @media (width >= 96rem) {
      max-width: 96rem;
    }
  }
  .-m-\[1px\] {
    margin: calc(1px * -1);
  }
  .m-4 {
    margin: calc(var(--spacing) * 4);
  }
  .-mx-1 {
    margin-inline: calc(var(--spacing) * -1);
  }
  .mx-0 {
    margin-inline: calc(var(--spacing) * 0);
  }
  .mx-auto {
    margin-inline: auto;
  }
  .-my-2 {
    margin-block: calc(var(--spacing) * -2);
  }
  .my-0 {
    margin-block: calc(var(--spacing) * 0);
  }
  .my-1 {
    margin-block: calc(var(--spacing) * 1);
  }
  .my-2 {
    margin-block: calc(var(--spacing) * 2);
  }
  .my-3 {
    margin-block: calc(var(--spacing) * 3);
  }
  .my-4 {
    margin-block: calc(var(--spacing) * 4);
  }
  .mt-0 {
    margin-top: calc(var(--spacing) * 0);
  }
  .mt-0\.5 {
    margin-top: calc(var(--spacing) * 0.5);
  }
  .mt-1 {
    margin-top: calc(var(--spacing) * 1);
  }
  .mt-2 {
    margin-top: calc(var(--spacing) * 2);
  }
  .mt-3 {
    margin-top: calc(var(--spacing) * 3);
  }
  .mt-4 {
    margin-top: calc(var(--spacing) * 4);
  }
  .mt-5 {
    margin-top: calc(var(--spacing) * 5);
  }
  .mt-6 {
    margin-top: calc(var(--spacing) * 6);
  }
  .mt-10 {
    margin-top: calc(var(--spacing) * 10);
  }
  .mt-auto {
    margin-top: auto;
  }
  .mr-1 {
    margin-right: calc(var(--spacing) * 1);
  }
  .mr-2 {
    margin-right: calc(var(--spacing) * 2);
  }
  .mr-3 {
    margin-right: calc(var(--spacing) * 3);
  }
  .mr-4 {
    margin-right: calc(var(--spacing) * 4);
  }
  .-mb-\[2px\] {
    margin-bottom: calc(2px * -1);
  }
  .mb-1 {
    margin-bottom: calc(var(--spacing) * 1);
  }
  .mb-2 {
    margin-bottom: calc(var(--spacing) * 2);
  }
  .mb-3 {
    margin-bottom: calc(var(--spacing) * 3);
  }
  .mb-4 {
    margin-bottom: calc(var(--spacing) * 4);
  }
  .mb-5 {
    margin-bottom: calc(var(--spacing) * 5);
  }
  .mb-6 {
    margin-bottom: calc(var(--spacing) * 6);
  }
  .mb-10 {
    margin-bottom: calc(var(--spacing) * 10);
  }
  .ml-1 {
    margin-left: calc(var(--spacing) * 1);
  }
  .ml-2 {
    margin-left: calc(var(--spacing) * 2);
  }
  .ml-3 {
    margin-left: calc(var(--spacing) * 3);
  }
  .ml-4 {
    margin-left: calc(var(--spacing) * 4);
  }
  .ml-5 {
    margin-left: calc(var(--spacing) * 5);
  }
  .ml-10 {
    margin-left: calc(var(--spacing) * 10);
  }
  .block {
    display: block;
  }
  .flex {
    display: flex;
  }
  .grid {
    display: grid;
  }
  .hidden {
    display: none;
  }
  .inline {
    display: inline;
  }
  .inline-block {
    display: inline-block;
  }
  .inline-flex {
    display: inline-flex;
  }
  .table {
    display: table;
  }
  .field-sizing-content {
    field-sizing: content;
  }
  .aspect-square {
    aspect-ratio: 1 / 1;
  }
  .aspect-video {
    aspect-ratio: var(--aspect-video);
  }
  .size-3 {
    width: calc(var(--spacing) * 3);
    height: calc(var(--spacing) * 3);
  }
  .size-4 {
    width: calc(var(--spacing) * 4);
    height: calc(var(--spacing) * 4);
  }
  .size-5 {
    width: calc(var(--spacing) * 5);
    height: calc(var(--spacing) * 5);
  }
  .size-6 {
    width: calc(var(--spacing) * 6);
    height: calc(var(--spacing) * 6);
  }
  .size-7 {
    width: calc(var(--spacing) * 7);
    height: calc(var(--spacing) * 7);
  }
  .size-8 {
    width: calc(var(--spacing) * 8);
    height: calc(var(--spacing) * 8);
  }
  .size-9 {
    width: calc(var(--spacing) * 9);
    height: calc(var(--spacing) * 9);
  }
  .size-10 {
    width: calc(var(--spacing) * 10);
    height: calc(var(--spacing) * 10);
  }
  .size-11 {
    width: calc(var(--spacing) * 11);
    height: calc(var(--spacing) * 11);
  }
  .size-13 {
    width: calc(var(--spacing) * 13);
    height: calc(var(--spacing) * 13);
  }
  .size-16 {
    width: calc(var(--spacing) * 16);
    height: calc(var(--spacing) * 16);
  }
  .h-1 {
    height: calc(var(--spacing) * 1);
  }
  .h-2 {
    height: calc(var(--spacing) * 2);
  }
  .h-3 {
    height: calc(var(--spacing) * 3);
  }
  .h-4 {
    height: calc(var(--spacing) * 4);
  }
  .h-5 {
    height: calc(var(--spacing) * 5);
  }
  .h-6 {
    height: calc(var(--spacing) * 6);
  }
  .h-7 {
    height: calc(var(--spacing) * 7);
  }
  .h-8 {
    height: calc(var(--spacing) * 8);
  }
  .h-9 {
    height: calc(var(--spacing) * 9);
  }
  .h-10 {
    height: calc(var(--spacing) * 10);
  }
  .h-11 {
    height: calc(var(--spacing) * 11);
  }
  .h-12 {
    height: calc(var(--spacing) * 12);
  }
  .h-13 {
    height: calc(var(--spacing) * 13);
  }
  .h-14 {
    height: calc(var(--spacing) * 14);
  }
  .h-16 {
    height: calc(var(--spacing) * 16);
  }
  .h-17 {
    height: calc(var(--spacing) * 17);
  }
  .h-20 {
    height: calc(var(--spacing) * 20);
  }
  .h-24 {
    height: calc(var(--spacing) * 24);
  }
  .h-\[1px\] {
    height: 1px;
  }
  .h-\[20px\] {
    height: 20px;
  }
  .h-\[22px\] {
    height: 22px;
  }
  .h-\[52px\] {
    height: 52px;
  }
  .h-\[60px\] {
    height: 60px;
  }
  .h-\[64px\] {
    height: 64px;
  }
  .h-\[104px\] {
    height: 104px;
  }
  .h-\[150px\] {
    height: 150px;
  }
  .h-\[188px\] {
    height: 188px;
  }
  .h-\[220px\] {
    height: 220px;
  }
  .h-\[calc\(100dvh-70px\)\] {
    height: calc(100dvh - 70px);
  }
  .h-auto {
    height: auto;
  }
  .h-fit {
    height: fit-content;
  }
  .h-full {
    height: 100%;
  }
  .h-min {
    height: min-content;
  }
  .h-px {
    height: 1px;
  }
  .max-h-\(--radix-dropdown-menu-content-available-height\) {
    max-height: var(--radix-dropdown-menu-content-available-height);
  }
  .max-h-96 {
    max-height: calc(var(--spacing) * 96);
  }
  .max-h-\[240px\] {
    max-height: 240px;
  }
  .max-h-\[360px\] {
    max-height: 360px;
  }
  .max-h-\[calc\(100dvh-80px\)\] {
    max-height: calc(100dvh - 80px);
  }
  .max-h-full {
    max-height: 100%;
  }
  .min-h-16 {
    min-height: calc(var(--spacing) * 16);
  }
  .min-h-\[64px\] {
    min-height: 64px;
  }
  .min-h-\[100px\] {
    min-height: 100px;
  }
  .min-h-full {
    min-height: 100%;
  }
  .w-1 {
    width: calc(var(--spacing) * 1);
  }
  .w-1\/2 {
    width: calc(1/2 * 100%);
  }
  .w-1\/3 {
    width: calc(1/3 * 100%);
  }
  .w-2 {
    width: calc(var(--spacing) * 2);
  }
  .w-2\/3 {
    width: calc(2/3 * 100%);
  }
  .w-3 {
    width: calc(var(--spacing) * 3);
  }
  .w-3\/4 {
    width: calc(3/4 * 100%);
  }
  .w-4 {
    width: calc(var(--spacing) * 4);
  }
  .w-5 {
    width: calc(var(--spacing) * 5);
  }
  .w-6 {
    width: calc(var(--spacing) * 6);
  }
  .w-7 {
    width: calc(var(--spacing) * 7);
  }
  .w-8 {
    width: calc(var(--spacing) * 8);
  }
  .w-9 {
    width: calc(var(--spacing) * 9);
  }
  .w-10 {
    width: calc(var(--spacing) * 10);
  }
  .w-11 {
    width: calc(var(--spacing) * 11);
  }
  .w-12 {
    width: calc(var(--spacing) * 12);
  }
  .w-13 {
    width: calc(var(--spacing) * 13);
  }
  .w-16 {
    width: calc(var(--spacing) * 16);
  }
  .w-17 {
    width: calc(var(--spacing) * 17);
  }
  .w-20 {
    width: calc(var(--spacing) * 20);
  }
  .w-24 {
    width: calc(var(--spacing) * 24);
  }
  .w-40 {
    width: calc(var(--spacing) * 40);
  }
  .w-72 {
    width: calc(var(--spacing) * 72);
  }
  .w-\[1px\] {
    width: 1px;
  }
  .w-\[22px\] {
    width: 22px;
  }
  .w-\[32px\] {
    width: 32px;
  }
  .w-\[46px\] {
    width: 46px;
  }
  .w-\[100px\] {
    width: 100px;
  }
  .w-\[124px\] {
    width: 124px;
  }
  .w-\[148px\] {
    width: 148px;
  }
  .w-\[150px\] {
    width: 150px;
  }
  .w-auto {
    width: auto;
  }
  .w-card-width {
    width: var(--spacing-card-width);
  }
  .w-fit {
    width: fit-content;
  }
  .w-full {
    width: 100%;
  }
  .w-max {
    width: max-content;
  }
  .w-min {
    width: min-content;
  }
  .w-screen {
    width: 100vw;
  }
  .max-w-\[532px\] {
    max-width: 532px;
  }
  .max-w-\[calc\(100\%-2rem\)\] {
    max-width: calc(100% - 2rem);
  }
  .max-w-full {
    max-width: 100%;
  }
  .min-w-0 {
    min-width: calc(var(--spacing) * 0);
  }
  .min-w-4 {
    min-width: calc(var(--spacing) * 4);
  }
  .min-w-5 {
    min-width: calc(var(--spacing) * 5);
  }
  .min-w-6 {
    min-width: calc(var(--spacing) * 6);
  }
  .min-w-7 {
    min-width: calc(var(--spacing) * 7);
  }
  .min-w-9 {
    min-width: calc(var(--spacing) * 9);
  }
  .min-w-11 {
    min-width: calc(var(--spacing) * 11);
  }
  .min-w-13 {
    min-width: calc(var(--spacing) * 13);
  }
  .min-w-\[8rem\] {
    min-width: 8rem;
  }
  .min-w-\[var\(--radix-select-trigger-width\)\] {
    min-width: var(--radix-select-trigger-width);
  }
  .min-w-full {
    min-width: 100%;
  }
  .flex-1 {
    flex: 1;
  }
  .flex-shrink {
    flex-shrink: 1;
  }
  .flex-shrink-0 {
    flex-shrink: 0;
  }
  .shrink-0 {
    flex-shrink: 0;
  }
  .flex-grow {
    flex-grow: 1;
  }
  .grow {
    flex-grow: 1;
  }
  .grow-0 {
    flex-grow: 0;
  }
  .border-collapse {
    border-collapse: collapse;
  }
  .origin-\(--radix-dropdown-menu-content-transform-origin\) {
    transform-origin: var(--radix-dropdown-menu-content-transform-origin);
  }
  .origin-\(--radix-popover-content-transform-origin\) {
    transform-origin: var(--radix-popover-content-transform-origin);
  }
  .origin-\(--radix-tooltip-content-transform-origin\) {
    transform-origin: var(--radix-tooltip-content-transform-origin);
  }
  .origin-bottom {
    transform-origin: bottom;
  }
  .origin-top {
    transform-origin: top;
  }
  .-translate-x-1 {
    --tw-translate-x: calc(var(--spacing) * -1);
    translate: var(--tw-translate-x) var(--tw-translate-y);
  }
  .translate-x-0 {
    --tw-translate-x: calc(var(--spacing) * 0);
    translate: var(--tw-translate-x) var(--tw-translate-y);
  }
  .translate-x-\[-50\%\] {
    --tw-translate-x: -50%;
    translate: var(--tw-translate-x) var(--tw-translate-y);
  }
  .-translate-y-1 {
    --tw-translate-y: calc(var(--spacing) * -1);
    translate: var(--tw-translate-x) var(--tw-translate-y);
  }
  .translate-y-\[-50\%\] {
    --tw-translate-y: -50%;
    translate: var(--tw-translate-x) var(--tw-translate-y);
  }
  .transform {
    transform: var(--tw-rotate-x,) var(--tw-rotate-y,) var(--tw-rotate-z,) var(--tw-skew-x,) var(--tw-skew-y,);
  }
  .animate-in {
    animation: enter var(--tw-animation-duration,var(--tw-duration,.15s))var(--tw-ease,ease)var(--tw-animation-delay,0s)var(--tw-animation-iteration-count,1)var(--tw-animation-direction,normal)var(--tw-animation-fill-mode,none);
  }
  .animate-shimmer {
    animation: var(--animate-shimmer);
  }
  .animate-skeleton {
    animation: skeleton 3s ease infinite;
  }
  .animate-spin {
    animation: var(--animate-spin);
  }
  .cursor-default {
    cursor: default;
  }
  .cursor-pointer {
    cursor: pointer;
  }
  .cursor-text {
    cursor: text;
  }
  .resize {
    resize: both;
  }
  .resize-none {
    resize: none;
  }
  .resize-y {
    resize: vertical;
  }
  .list-disc {
    list-style-type: disc;
  }
  .list-none {
    list-style-type: none;
  }
  .appearance-none {
    appearance: none;
  }
  .grid-cols-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .grid-cols-5 {
    grid-template-columns: repeat(5, minmax(0, 1fr));
  }
  .grid-cols-\[repeat\(auto-fill\,minmax\(150px\,1fr\)\)\] {
    grid-template-columns: repeat(auto-fill,minmax(150px,1fr));
  }
  .flex-col {
    flex-direction: column;
  }
  .flex-col-reverse {
    flex-direction: column-reverse;
  }
  .flex-row {
    flex-direction: row;
  }
  .flex-wrap {
    flex-wrap: wrap;
  }
  .place-content-center {
    place-content: center;
  }
  .place-items-center {
    place-items: center;
  }
  .items-center {
    align-items: center;
  }
  .items-end {
    align-items: flex-end;
  }
  .items-start {
    align-items: flex-start;
  }
  .items-stretch {
    align-items: stretch;
  }
  .justify-between {
    justify-content: space-between;
  }
  .justify-center {
    justify-content: center;
  }
  .justify-end {
    justify-content: flex-end;
  }
  .justify-start {
    justify-content: flex-start;
  }
  .gap-0 {
    gap: calc(var(--spacing) * 0);
  }
  .gap-0\.5 {
    gap: calc(var(--spacing) * 0.5);
  }
  .gap-1 {
    gap: calc(var(--spacing) * 1);
  }
  .gap-1\.5 {
    gap: calc(var(--spacing) * 1.5);
  }
  .gap-2 {
    gap: calc(var(--spacing) * 2);
  }
  .gap-3 {
    gap: calc(var(--spacing) * 3);
  }
  .gap-4 {
    gap: calc(var(--spacing) * 4);
  }
  .gap-5 {
    gap: calc(var(--spacing) * 5);
  }
  .gap-6 {
    gap: calc(var(--spacing) * 6);
  }
  .gap-8 {
    gap: calc(var(--spacing) * 8);
  }
  .gap-10 {
    gap: calc(var(--spacing) * 10);
  }
  .space-y-2 {
    :where(& > :not(:last-child)) {
      --tw-space-y-reverse: 0;
      margin-block-start: calc(calc(var(--spacing) * 2) * var(--tw-space-y-reverse));
      margin-block-end: calc(calc(var(--spacing) * 2) * calc(1 - var(--tw-space-y-reverse)));
    }
  }
  .space-y-4 {
    :where(& > :not(:last-child)) {
      --tw-space-y-reverse: 0;
      margin-block-start: calc(calc(var(--spacing) * 4) * var(--tw-space-y-reverse));
      margin-block-end: calc(calc(var(--spacing) * 4) * calc(1 - var(--tw-space-y-reverse)));
    }
  }
  .self-center {
    align-self: center;
  }
  .justify-self-center {
    justify-self: center;
  }
  .justify-self-end {
    justify-self: flex-end;
  }
  .truncate {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .overflow-auto {
    overflow: auto;
  }
  .overflow-hidden {
    overflow: hidden;
  }
  .overflow-scroll {
    overflow: scroll;
  }
  .overflow-visible {
    overflow: visible;
  }
  .overflow-x-auto {
    overflow-x: auto;
  }
  .overflow-x-hidden {
    overflow-x: hidden;
  }
  .overflow-x-scroll {
    overflow-x: scroll;
  }
  .overflow-y-auto {
    overflow-y: auto;
  }
  .overscroll-x-contain {
    overscroll-behavior-x: contain;
  }
  .overscroll-y-contain {
    overscroll-behavior-y: contain;
  }
  .rounded {
    border-radius: 0.25rem;
  }
  .rounded-2xl {
    border-radius: var(--radius-2xl);
  }
  .rounded-\[12px\] {
    border-radius: 12px;
  }
  .rounded-full {
    border-radius: calc(infinity * 1px);
  }
  .rounded-lg {
    border-radius: var(--radius-lg);
  }
  .rounded-md {
    border-radius: var(--radius-md);
  }
  .rounded-none {
    border-radius: 0;
  }
  .rounded-sm {
    border-radius: var(--radius-sm);
  }
  .rounded-xl {
    border-radius: var(--radius-xl);
  }
  .rounded-xs {
    border-radius: var(--radius-xs);
  }
  .rounded-t-2xl {
    border-top-left-radius: var(--radius-2xl);
    border-top-right-radius: var(--radius-2xl);
  }
  .rounded-t-sm {
    border-top-left-radius: var(--radius-sm);
    border-top-right-radius: var(--radius-sm);
  }
  .rounded-b-none {
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;
  }
  .border {
    border-style: var(--tw-border-style);
    border-width: 1px;
  }
  .border-0 {
    border-style: var(--tw-border-style);
    border-width: 0px;
  }
  .border-1 {
    border-style: var(--tw-border-style);
    border-width: 1px;
  }
  .border-2 {
    border-style: var(--tw-border-style);
    border-width: 2px;
  }
  .border-t {
    border-top-style: var(--tw-border-style);
    border-top-width: 1px;
  }
  .border-t-1 {
    border-top-style: var(--tw-border-style);
    border-top-width: 1px;
  }
  .border-r {
    border-right-style: var(--tw-border-style);
    border-right-width: 1px;
  }
  .border-b {
    border-bottom-style: var(--tw-border-style);
    border-bottom-width: 1px;
  }
  .border-b-1 {
    border-bottom-style: var(--tw-border-style);
    border-bottom-width: 1px;
  }
  .border-b-2 {
    border-bottom-style: var(--tw-border-style);
    border-bottom-width: 2px;
  }
  .border-l {
    border-left-style: var(--tw-border-style);
    border-left-width: 1px;
  }
  .border-dashed {
    --tw-border-style: dashed;
    border-style: dashed;
  }
  .border-none {
    --tw-border-style: none;
    border-style: none;
  }
  .border-solid {
    --tw-border-style: solid;
    border-style: solid;
  }
  .border-background-primary {
    border-color: var(--seq-color-background-primary);
  }
  .border-border-base {
    border-color: var(--color-border-base);
  }
  .border-border-button {
    border-color: var(--seq-color-border-button);
  }
  .border-border-card {
    border-color: var(--seq-color-border-card);
  }
  .border-border-focus {
    border-color: var(--color-border-focus);
  }
  .border-border-normal {
    border-color: var(--seq-color-border-normal);
  }
  .border-red-900 {
    border-color: var(--color-red-900);
  }
  .border-transparent {
    border-color: transparent;
  }
  .border-violet-600 {
    border-color: var(--color-violet-600);
  }
  .border-b-primary {
    border-bottom-color: var(--seq-color-primary);
  }
  .border-b-transparent {
    border-bottom-color: transparent;
  }
  .bg-\[\#2b0000\] {
    background-color: #2b0000;
  }
  .bg-\[\#35a554\] {
    background-color: #35a554;
  }
  .bg-\[hsla\(39\,71\%\,40\%\,0\.3\)\] {
    background-color: hsla(39,71%,40%,0.3);
  }
  .bg-\[hsla\(247\,100\%\,75\%\,0\.3\)\] {
    background-color: hsla(247,100%,75%,0.3);
  }
  .bg-background-active {
    background-color: var(--seq-color-background-active);
  }
  .bg-background-input {
    background-color: var(--seq-color-background-input);
  }
  .bg-background-inverse {
    background-color: var(--seq-color-background-inverse);
  }
  .bg-background-muted {
    background-color: var(--seq-color-background-muted);
  }
  .bg-background-overlay {
    background-color: var(--seq-color-background-overlay);
  }
  .bg-background-primary {
    background-color: var(--seq-color-background-primary);
  }
  .bg-background-primary\/70 {
    background-color: var(--seq-color-background-primary);
    @supports (color: color-mix(in lab, red, red)) {
      background-color: color-mix(in oklab, var(--seq-color-background-primary) 70%, transparent);
    }
  }
  .bg-background-raised {
    background-color: var(--seq-color-background-raised);
  }
  .bg-background-secondary {
    background-color: var(--seq-color-background-secondary);
  }
  .bg-blue-500 {
    background-color: var(--color-blue-500);
  }
  .bg-border-normal {
    background-color: var(--seq-color-border-normal);
  }
  .bg-destructive {
    background-color: var(--seq-color-destructive);
  }
  .bg-green-500 {
    background-color: var(--color-green-500);
  }
  .bg-info {
    background-color: var(--seq-color-info);
  }
  .bg-negative {
    background-color: var(--seq-color-negative);
  }
  .bg-overlay-light {
    background-color: var(--color-overlay-light);
  }
  .bg-positive {
    background-color: var(--seq-color-positive);
  }
  .bg-primary {
    background-color: var(--seq-color-primary);
  }
  .bg-primary\/20 {
    background-color: var(--seq-color-primary);
    @supports (color: color-mix(in lab, red, red)) {
      background-color: color-mix(in oklab, var(--seq-color-primary) 20%, transparent);
    }
  }
  .bg-primary\/50 {
    background-color: var(--seq-color-primary);
    @supports (color: color-mix(in lab, red, red)) {
      background-color: color-mix(in oklab, var(--seq-color-primary) 50%, transparent);
    }
  }
  .bg-red-500 {
    background-color: var(--color-red-500);
  }
  .bg-red-900 {
    background-color: var(--color-red-900);
  }
  .bg-red-950 {
    background-color: var(--color-red-950);
  }
  .bg-surface-neutral {
    background-color: var(--color-surface-neutral);
  }
  .bg-transparent {
    background-color: transparent;
  }
  .bg-warning {
    background-color: var(--seq-color-warning);
  }
  .bg-white {
    background-color: var(--color-white);
  }
  .bg-gradient-primary {
    background-image: var(--seq-color-gradient-primary);
  }
  .bg-gradient-secondary {
    background-image: var(--seq-color-gradient-secondary);
  }
  .bg-gradient-skeleton {
    background-image: var(--seq-color-gradient-skeleton);
  }
  .bg-none {
    background-image: none;
  }
  .\[mask-image\:radial-gradient\(circle_at_82\%_82\%\,transparent_22\%\,black_0\)\] {
    mask-image: radial-gradient(circle at 82% 82%,transparent 22%,black 0);
  }
  .bg-\[length\:400\%_400\%\] {
    background-size: 400% 400%;
  }
  .bg-no-repeat {
    background-repeat: no-repeat;
  }
  .bg-origin-border {
    background-origin: border-box;
  }
  .fill-background-raised {
    fill: var(--seq-color-background-raised);
  }
  .fill-primary {
    fill: var(--seq-color-primary);
  }
  .object-contain {
    object-fit: contain;
  }
  .object-cover {
    object-fit: cover;
  }
  .p-0 {
    padding: calc(var(--spacing) * 0);
  }
  .p-0\.75 {
    padding: calc(var(--spacing) * 0.75);
  }
  .p-1 {
    padding: calc(var(--spacing) * 1);
  }
  .p-2 {
    padding: calc(var(--spacing) * 2);
  }
  .p-3 {
    padding: calc(var(--spacing) * 3);
  }
  .p-4 {
    padding: calc(var(--spacing) * 4);
  }
  .p-5 {
    padding: calc(var(--spacing) * 5);
  }
  .p-6 {
    padding: calc(var(--spacing) * 6);
  }
  .p-7 {
    padding: calc(var(--spacing) * 7);
  }
  .p-8 {
    padding: calc(var(--spacing) * 8);
  }
  .p-\[10px\] {
    padding: 10px;
  }
  .px-0 {
    padding-inline: calc(var(--spacing) * 0);
  }
  .px-1 {
    padding-inline: calc(var(--spacing) * 1);
  }
  .px-2 {
    padding-inline: calc(var(--spacing) * 2);
  }
  .px-3 {
    padding-inline: calc(var(--spacing) * 3);
  }
  .px-4 {
    padding-inline: calc(var(--spacing) * 4);
  }
  .px-5 {
    padding-inline: calc(var(--spacing) * 5);
  }
  .px-6 {
    padding-inline: calc(var(--spacing) * 6);
  }
  .px-10 {
    padding-inline: calc(var(--spacing) * 10);
  }
  .py-1 {
    padding-block: calc(var(--spacing) * 1);
  }
  .py-1\.5 {
    padding-block: calc(var(--spacing) * 1.5);
  }
  .py-2 {
    padding-block: calc(var(--spacing) * 2);
  }
  .py-3 {
    padding-block: calc(var(--spacing) * 3);
  }
  .py-4 {
    padding-block: calc(var(--spacing) * 4);
  }
  .py-6 {
    padding-block: calc(var(--spacing) * 6);
  }
  .pt-0 {
    padding-top: calc(var(--spacing) * 0);
  }
  .pt-1 {
    padding-top: calc(var(--spacing) * 1);
  }
  .pt-2 {
    padding-top: calc(var(--spacing) * 2);
  }
  .pt-3 {
    padding-top: calc(var(--spacing) * 3);
  }
  .pt-4 {
    padding-top: calc(var(--spacing) * 4);
  }
  .pt-5 {
    padding-top: calc(var(--spacing) * 5);
  }
  .pt-\[60px\] {
    padding-top: 60px;
  }
  .pr-2 {
    padding-right: calc(var(--spacing) * 2);
  }
  .pr-3 {
    padding-right: calc(var(--spacing) * 3);
  }
  .pr-4 {
    padding-right: calc(var(--spacing) * 4);
  }
  .pb-0 {
    padding-bottom: calc(var(--spacing) * 0);
  }
  .pb-2 {
    padding-bottom: calc(var(--spacing) * 2);
  }
  .pb-3 {
    padding-bottom: calc(var(--spacing) * 3);
  }
  .pb-4 {
    padding-bottom: calc(var(--spacing) * 4);
  }
  .pb-5 {
    padding-bottom: calc(var(--spacing) * 5);
  }
  .pb-6 {
    padding-bottom: calc(var(--spacing) * 6);
  }
  .pb-\[calc\(env\(safe-area-inset-bottom\)\)\] {
    padding-bottom: calc(env(safe-area-inset-bottom));
  }
  .pl-1 {
    padding-left: calc(var(--spacing) * 1);
  }
  .pl-2 {
    padding-left: calc(var(--spacing) * 2);
  }
  .pl-3 {
    padding-left: calc(var(--spacing) * 3);
  }
  .pl-4 {
    padding-left: calc(var(--spacing) * 4);
  }
  .pl-6 {
    padding-left: calc(var(--spacing) * 6);
  }
  .text-center {
    text-align: center;
  }
  .text-left {
    text-align: left;
  }
  .text-right {
    text-align: right;
  }
  .type-normal {
    font-family: "Inter", ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
    font-size: var(--text-sm);
    line-height: var(--tw-leading, var(--text-sm--line-height));
    --tw-leading: calc(var(--spacing) * 5);
    line-height: calc(var(--spacing) * 5);
    --tw-font-weight: var(--font-weight-medium);
    font-weight: var(--font-weight-medium);
    --tw-tracking: var(--tracking-wide);
    letter-spacing: var(--tracking-wide);
  }
  .type-small {
    font-family: "Inter", ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
    font-size: var(--text-xs);
    line-height: var(--tw-leading, var(--text-xs--line-height));
    --tw-leading: calc(var(--spacing) * 4);
    line-height: calc(var(--spacing) * 4);
    --tw-font-weight: var(--font-weight-medium);
    font-weight: var(--font-weight-medium);
    --tw-tracking: var(--tracking-wide);
    letter-spacing: var(--tracking-wide);
  }
  .font-body {
    font-family: "Inter", ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
  }
  .font-mono {
    font-family: "Roboto", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  }
  .text-2xl {
    font-size: var(--text-2xl);
    line-height: var(--tw-leading, var(--text-2xl--line-height));
  }
  .text-4xl {
    font-size: var(--text-4xl);
    line-height: var(--tw-leading, var(--text-4xl--line-height));
  }
  .text-6xl {
    font-size: var(--text-6xl);
    line-height: var(--tw-leading, var(--text-6xl--line-height));
  }
  .text-base {
    font-size: var(--text-base);
    line-height: var(--tw-leading, var(--text-base--line-height));
  }
  .text-lg {
    font-size: var(--text-lg);
    line-height: var(--tw-leading, var(--text-lg--line-height));
  }
  .text-sm {
    font-size: var(--text-sm);
    line-height: var(--tw-leading, var(--text-sm--line-height));
  }
  .text-xl {
    font-size: var(--text-xl);
    line-height: var(--tw-leading, var(--text-xl--line-height));
  }
  .text-xs {
    font-size: var(--text-xs);
    line-height: var(--tw-leading, var(--text-xs--line-height));
  }
  .text-\[0\.625rem\] {
    font-size: 0.625rem;
  }
  .text-\[4px\] {
    font-size: 4px;
  }
  .text-\[6px\] {
    font-size: 6px;
  }
  .text-\[9px\] {
    font-size: 9px;
  }
  .text-\[11px\] {
    font-size: 11px;
  }
  .text-\[16px\] {
    font-size: 16px;
  }
  .leading-0 {
    --tw-leading: calc(var(--spacing) * 0);
    line-height: calc(var(--spacing) * 0);
  }
  .leading-4 {
    --tw-leading: calc(var(--spacing) * 4);
    line-height: calc(var(--spacing) * 4);
  }
  .leading-5 {
    --tw-leading: calc(var(--spacing) * 5);
    line-height: calc(var(--spacing) * 5);
  }
  .leading-6 {
    --tw-leading: calc(var(--spacing) * 6);
    line-height: calc(var(--spacing) * 6);
  }
  .leading-7 {
    --tw-leading: calc(var(--spacing) * 7);
    line-height: calc(var(--spacing) * 7);
  }
  .leading-8 {
    --tw-leading: calc(var(--spacing) * 8);
    line-height: calc(var(--spacing) * 8);
  }
  .leading-10 {
    --tw-leading: calc(var(--spacing) * 10);
    line-height: calc(var(--spacing) * 10);
  }
  .leading-15 {
    --tw-leading: calc(var(--spacing) * 15);
    line-height: calc(var(--spacing) * 15);
  }
  .leading-snug {
    --tw-leading: var(--leading-snug);
    line-height: var(--leading-snug);
  }
  .font-bold {
    --tw-font-weight: var(--font-weight-bold);
    font-weight: var(--font-weight-bold);
  }
  .font-medium {
    --tw-font-weight: var(--font-weight-medium);
    font-weight: var(--font-weight-medium);
  }
  .font-normal {
    --tw-font-weight: var(--font-weight-normal);
    font-weight: var(--font-weight-normal);
  }
  .font-semibold {
    --tw-font-weight: var(--font-weight-semibold);
    font-weight: var(--font-weight-semibold);
  }
  .tracking-normal {
    --tw-tracking: var(--tracking-normal);
    letter-spacing: var(--tracking-normal);
  }
  .tracking-wide {
    --tw-tracking: var(--tracking-wide);
    letter-spacing: var(--tracking-wide);
  }
  .tracking-widest {
    --tw-tracking: var(--tracking-widest);
    letter-spacing: var(--tracking-widest);
  }
  .text-wrap {
    text-wrap: wrap;
  }
  .break-words {
    overflow-wrap: break-word;
  }
  .text-ellipsis {
    text-overflow: ellipsis;
  }
  .whitespace-nowrap {
    white-space: nowrap;
  }
  .whitespace-pre-wrap {
    white-space: pre-wrap;
  }
  .text-background-primary {
    color: var(--seq-color-background-primary);
  }
  .text-background-raised {
    color: var(--seq-color-background-raised);
  }
  .text-background-secondary {
    color: var(--seq-color-background-secondary);
  }
  .text-black {
    color: var(--color-black);
  }
  .text-current {
    color: currentcolor;
  }
  .text-destructive {
    color: var(--seq-color-destructive);
  }
  .text-gray-500 {
    color: var(--color-gray-500);
  }
  .text-indigo-400 {
    color: var(--color-indigo-400);
  }
  .text-info {
    color: var(--seq-color-info);
  }
  .text-inherit {
    color: inherit;
  }
  .text-inverse {
    color: var(--seq-color-inverse);
  }
  .text-muted {
    color: var(--seq-color-muted);
  }
  .text-negative {
    color: var(--seq-color-negative);
  }
  .text-positive {
    color: var(--seq-color-positive);
  }
  .text-primary {
    color: var(--seq-color-primary);
  }
  .text-red-100 {
    color: var(--color-red-100);
  }
  .text-red-300 {
    color: var(--color-red-300);
  }
  .text-red-400 {
    color: var(--color-red-400);
  }
  .text-red-500 {
    color: var(--color-red-500);
  }
  .text-secondary {
    color: var(--seq-color-secondary);
  }
  .text-text-50 {
    color: var(--color-text-50);
  }
  .text-text-80 {
    color: var(--color-text-80);
  }
  .text-text-100 {
    color: var(--color-text-100);
  }
  .text-violet-400 {
    color: var(--color-violet-400);
  }
  .text-warning {
    color: var(--seq-color-warning);
  }
  .text-white {
    color: var(--color-white);
  }
  .capitalize {
    text-transform: capitalize;
  }
  .uppercase {
    text-transform: uppercase;
  }
  .italic {
    font-style: italic;
  }
  .no-underline {
    text-decoration-line: none;
  }
  .underline {
    text-decoration-line: underline;
  }
  .placeholder-muted {
    &::placeholder {
      color: var(--seq-color-muted);
    }
  }
  .caret-transparent {
    caret-color: transparent;
  }
  .opacity-0 {
    opacity: 0%;
  }
  .opacity-50 {
    opacity: 50%;
  }
  .opacity-70 {
    opacity: 70%;
  }
  .opacity-75 {
    opacity: 75%;
  }
  .opacity-100 {
    opacity: 100%;
  }
  .opacity-\[0\.4_\!important\] {
    opacity: 0.4 !important;
  }
  .shadow {
    --tw-shadow: 0 1px 3px 0 var(--tw-shadow-color, rgb(0 0 0 / 0.1)), 0 1px 2px -1px var(--tw-shadow-color, rgb(0 0 0 / 0.1));
    box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);
  }
  .shadow-lg {
    --tw-shadow: 0 10px 15px -3px var(--tw-shadow-color, rgb(0 0 0 / 0.1)), 0 4px 6px -4px var(--tw-shadow-color, rgb(0 0 0 / 0.1));
    box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);
  }
  .shadow-primary {
    --tw-shadow: 0 0 16px 0 var(--tw-shadow-color, var(--seq-color-drop-shadow));
    box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);
  }
  .shadow-sm {
    --tw-shadow: 0 1px 3px 0 var(--tw-shadow-color, rgb(0 0 0 / 0.1)), 0 1px 2px -1px var(--tw-shadow-color, rgb(0 0 0 / 0.1));
    box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);
  }
  .ring-1 {
    --tw-ring-shadow: var(--tw-ring-inset,) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color, currentcolor);
    box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);
  }
  .ring-2 {
    --tw-ring-shadow: var(--tw-ring-inset,) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color, currentcolor);
    box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);
  }
  .ring-border-focus {
    --tw-ring-color: var(--color-border-focus);
  }
  .ring-border-normal {
    --tw-ring-color: var(--seq-color-border-normal);
  }
  .ring-white {
    --tw-ring-color: var(--color-white);
  }
  .outline-hidden {
    --tw-outline-style: none;
    outline-style: none;
    @media (forced-colors: active) {
      outline: 2px solid transparent;
      outline-offset: 2px;
    }
  }
  .outline {
    outline-style: var(--tw-outline-style);
    outline-width: 1px;
  }
  .outline-offset-1 {
    outline-offset: 1px;
  }
  .outline-offset-\[-2px\] {
    outline-offset: -2px;
  }
  .blur {
    --tw-blur: blur(8px);
    filter: var(--tw-blur,) var(--tw-brightness,) var(--tw-contrast,) var(--tw-grayscale,) var(--tw-hue-rotate,) var(--tw-invert,) var(--tw-saturate,) var(--tw-sepia,) var(--tw-drop-shadow,);
  }
  .blur-xs {
    --tw-blur: blur(var(--blur-xs));
    filter: var(--tw-blur,) var(--tw-brightness,) var(--tw-contrast,) var(--tw-grayscale,) var(--tw-hue-rotate,) var(--tw-invert,) var(--tw-saturate,) var(--tw-sepia,) var(--tw-drop-shadow,);
  }
  .filter {
    filter: var(--tw-blur,) var(--tw-brightness,) var(--tw-contrast,) var(--tw-grayscale,) var(--tw-hue-rotate,) var(--tw-invert,) var(--tw-saturate,) var(--tw-sepia,) var(--tw-drop-shadow,);
  }
  .backdrop-blur {
    --tw-backdrop-blur: blur(8px);
    -webkit-backdrop-filter: var(--tw-backdrop-blur,) var(--tw-backdrop-brightness,) var(--tw-backdrop-contrast,) var(--tw-backdrop-grayscale,) var(--tw-backdrop-hue-rotate,) var(--tw-backdrop-invert,) var(--tw-backdrop-opacity,) var(--tw-backdrop-saturate,) var(--tw-backdrop-sepia,);
    backdrop-filter: var(--tw-backdrop-blur,) var(--tw-backdrop-brightness,) var(--tw-backdrop-contrast,) var(--tw-backdrop-grayscale,) var(--tw-backdrop-hue-rotate,) var(--tw-backdrop-invert,) var(--tw-backdrop-opacity,) var(--tw-backdrop-saturate,) var(--tw-backdrop-sepia,);
  }
  .backdrop-blur-md {
    --tw-backdrop-blur: blur(var(--blur-md));
    -webkit-backdrop-filter: var(--tw-backdrop-blur,) var(--tw-backdrop-brightness,) var(--tw-backdrop-contrast,) var(--tw-backdrop-grayscale,) var(--tw-backdrop-hue-rotate,) var(--tw-backdrop-invert,) var(--tw-backdrop-opacity,) var(--tw-backdrop-saturate,) var(--tw-backdrop-sepia,);
    backdrop-filter: var(--tw-backdrop-blur,) var(--tw-backdrop-brightness,) var(--tw-backdrop-contrast,) var(--tw-backdrop-grayscale,) var(--tw-backdrop-hue-rotate,) var(--tw-backdrop-invert,) var(--tw-backdrop-opacity,) var(--tw-backdrop-saturate,) var(--tw-backdrop-sepia,);
  }
  .backdrop-blur-xs {
    --tw-backdrop-blur: blur(var(--blur-xs));
    -webkit-backdrop-filter: var(--tw-backdrop-blur,) var(--tw-backdrop-brightness,) var(--tw-backdrop-contrast,) var(--tw-backdrop-grayscale,) var(--tw-backdrop-hue-rotate,) var(--tw-backdrop-invert,) var(--tw-backdrop-opacity,) var(--tw-backdrop-saturate,) var(--tw-backdrop-sepia,);
    backdrop-filter: var(--tw-backdrop-blur,) var(--tw-backdrop-brightness,) var(--tw-backdrop-contrast,) var(--tw-backdrop-grayscale,) var(--tw-backdrop-hue-rotate,) var(--tw-backdrop-invert,) var(--tw-backdrop-opacity,) var(--tw-backdrop-saturate,) var(--tw-backdrop-sepia,);
  }
  .backdrop-filter {
    -webkit-backdrop-filter: var(--tw-backdrop-blur,) var(--tw-backdrop-brightness,) var(--tw-backdrop-contrast,) var(--tw-backdrop-grayscale,) var(--tw-backdrop-hue-rotate,) var(--tw-backdrop-invert,) var(--tw-backdrop-opacity,) var(--tw-backdrop-saturate,) var(--tw-backdrop-sepia,);
    backdrop-filter: var(--tw-backdrop-blur,) var(--tw-backdrop-brightness,) var(--tw-backdrop-contrast,) var(--tw-backdrop-grayscale,) var(--tw-backdrop-hue-rotate,) var(--tw-backdrop-invert,) var(--tw-backdrop-opacity,) var(--tw-backdrop-saturate,) var(--tw-backdrop-sepia,);
  }
  .transition {
    transition-property: color, background-color, border-color, outline-color, text-decoration-color, fill, stroke, --tw-gradient-from, --tw-gradient-via, --tw-gradient-to, opacity, box-shadow, transform, translate, scale, rotate, filter, -webkit-backdrop-filter, backdrop-filter, display, content-visibility, overlay, pointer-events;
    transition-timing-function: var(--tw-ease, var(--default-transition-timing-function));
    transition-duration: var(--tw-duration, var(--default-transition-duration));
  }
  .transition-all {
    transition-property: all;
    transition-timing-function: var(--tw-ease, var(--default-transition-timing-function));
    transition-duration: var(--tw-duration, var(--default-transition-duration));
  }
  .transition-colors {
    transition-property: color, background-color, border-color, outline-color, text-decoration-color, fill, stroke, --tw-gradient-from, --tw-gradient-via, --tw-gradient-to;
    transition-timing-function: var(--tw-ease, var(--default-transition-timing-function));
    transition-duration: var(--tw-duration, var(--default-transition-duration));
  }
  .transition-opacity {
    transition-property: opacity;
    transition-timing-function: var(--tw-ease, var(--default-transition-timing-function));
    transition-duration: var(--tw-duration, var(--default-transition-duration));
  }
  .transition-shadow {
    transition-property: box-shadow;
    transition-timing-function: var(--tw-ease, var(--default-transition-timing-function));
    transition-duration: var(--tw-duration, var(--default-transition-duration));
  }
  .transition-transform {
    transition-property: transform, translate, scale, rotate;
    transition-timing-function: var(--tw-ease, var(--default-transition-timing-function));
    transition-duration: var(--tw-duration, var(--default-transition-duration));
  }
  .transition-none {
    transition-property: none;
  }
  .duration-100 {
    --tw-duration: 100ms;
    transition-duration: 100ms;
  }
  .duration-200 {
    --tw-duration: 200ms;
    transition-duration: 200ms;
  }
  .ease-in-out {
    --tw-ease: var(--ease-in-out);
    transition-timing-function: var(--ease-in-out);
  }
  .ease-out {
    --tw-ease: var(--ease-out);
    transition-timing-function: var(--ease-out);
  }
  .will-change-transform {
    will-change: transform;
  }
  .fade-in-0 {
    --tw-enter-opacity: calc(0/100);
    --tw-enter-opacity: 0;
  }
  .outline-none {
    --tw-outline-style: none;
    outline-style: none;
  }
  .select-none {
    -webkit-user-select: none;
    user-select: none;
  }
  .zoom-in-95 {
    --tw-enter-scale: calc(95*1%);
    --tw-enter-scale: .95;
  }
  .paused {
    animation-play-state: paused;
  }
  .ring-inset {
    --tw-ring-inset: inset;
  }
  .running {
    animation-play-state: running;
  }
  .group-focus-within\/input-group\:opacity-0 {
    &:is(:where(.group\/input-group):focus-within *) {
      opacity: 0%;
    }
  }
  .group-hover\:translate-y-\[-64px\] {
    &:is(:where(.group):hover *) {
      @media (hover: hover) {
        --tw-translate-y: -64px;
        translate: var(--tw-translate-x) var(--tw-translate-y);
      }
    }
  }
  .group-hover\:scale-hover {
    &:is(:where(.group):hover *) {
      @media (hover: hover) {
        --tw-scale-x: var(--scale-hover);
        --tw-scale-y: var(--scale-hover);
        --tw-scale-z: var(--scale-hover);
        scale: var(--tw-scale-x) var(--tw-scale-y);
      }
    }
  }
  .group-has-\[\[data-orientation\=horizontal\]\]\/field\:text-balance {
    &:is(:where(.group\/field):has(*:is([data-orientation=horizontal])) *) {
      text-wrap: balance;
    }
  }
  .group-has-\[\>input\]\/input-group\:pt-2\.5 {
    &:is(:where(.group\/input-group):has(>input) *) {
      padding-top: calc(var(--spacing) * 2.5);
    }
  }
  .group-has-\[\>input\]\/input-group\:pb-2\.5 {
    &:is(:where(.group\/input-group):has(>input) *) {
      padding-bottom: calc(var(--spacing) * 2.5);
    }
  }
  .group-data-\[disabled\=true\]\:pointer-events-none {
    &:is(:where(.group)[data-disabled="true"] *) {
      pointer-events: none;
    }
  }
  .group-data-\[disabled\=true\]\:opacity-50 {
    &:is(:where(.group)[data-disabled="true"] *) {
      opacity: 50%;
    }
  }
  .group-data-\[disabled\=true\]\/field\:opacity-50 {
    &:is(:where(.group\/field)[data-disabled="true"] *) {
      opacity: 50%;
    }
  }
  .group-data-\[disabled\=true\]\/input-group\:opacity-50 {
    &:is(:where(.group\/input-group)[data-disabled="true"] *) {
      opacity: 50%;
    }
  }
  .group-data-\[variant\=outline\]\/field-group\:-mb-2 {
    &:is(:where(.group\/field-group)[data-variant="outline"] *) {
      margin-bottom: calc(var(--spacing) * -2);
    }
  }
  .peer-disabled\:cursor-not-allowed {
    &:is(:where(.peer):disabled ~ *) {
      cursor: not-allowed;
    }
  }
  .peer-disabled\:opacity-50 {
    &:is(:where(.peer):disabled ~ *) {
      opacity: 50%;
    }
  }
  .selection\:bg-transparent {
    & *::selection {
      background-color: transparent;
    }
    &::selection {
      background-color: transparent;
    }
  }
  .file\:inline-flex {
    &::file-selector-button {
      display: inline-flex;
    }
  }
  .file\:h-13 {
    &::file-selector-button {
      height: calc(var(--spacing) * 13);
    }
  }
  .file\:border-0 {
    &::file-selector-button {
      border-style: var(--tw-border-style);
      border-width: 0px;
    }
  }
  .file\:bg-transparent {
    &::file-selector-button {
      background-color: transparent;
    }
  }
  .file\:text-sm {
    &::file-selector-button {
      font-size: var(--text-sm);
      line-height: var(--tw-leading, var(--text-sm--line-height));
    }
  }
  .file\:font-medium {
    &::file-selector-button {
      --tw-font-weight: var(--font-weight-medium);
      font-weight: var(--font-weight-medium);
    }
  }
  .file\:text-primary {
    &::file-selector-button {
      color: var(--seq-color-primary);
    }
  }
  .placeholder\:text-muted {
    &::placeholder {
      color: var(--seq-color-muted);
    }
  }
  .before\:pointer-events-none {
    &::before {
      content: var(--tw-content);
      pointer-events: none;
    }
  }
  .before\:absolute {
    &::before {
      content: var(--tw-content);
      position: absolute;
    }
  }
  .before\:-top-4 {
    &::before {
      content: var(--tw-content);
      top: calc(var(--spacing) * -4);
    }
  }
  .before\:top-0 {
    &::before {
      content: var(--tw-content);
      top: calc(var(--spacing) * 0);
    }
  }
  .before\:-bottom-4 {
    &::before {
      content: var(--tw-content);
      bottom: calc(var(--spacing) * -4);
    }
  }
  .before\:left-0 {
    &::before {
      content: var(--tw-content);
      left: calc(var(--spacing) * 0);
    }
  }
  .before\:z-10 {
    &::before {
      content: var(--tw-content);
      z-index: 10;
    }
  }
  .before\:z-\[11\] {
    &::before {
      content: var(--tw-content);
      z-index: 11;
    }
  }
  .before\:hidden {
    &::before {
      content: var(--tw-content);
      display: none;
    }
  }
  .before\:h-4 {
    &::before {
      content: var(--tw-content);
      height: calc(var(--spacing) * 4);
    }
  }
  .before\:h-full {
    &::before {
      content: var(--tw-content);
      height: 100%;
    }
  }
  .before\:w-4 {
    &::before {
      content: var(--tw-content);
      width: calc(var(--spacing) * 4);
    }
  }
  .before\:w-full {
    &::before {
      content: var(--tw-content);
      width: 100%;
    }
  }
  .before\:bg-linear-to-l {
    &::before {
      content: var(--tw-content);
      --tw-gradient-position: to left;
      @supports (background-image: linear-gradient(in lab, red, red)) {
        --tw-gradient-position: to left in oklab;
      }
      background-image: linear-gradient(var(--tw-gradient-stops));
    }
  }
  .before\:bg-linear-to-t {
    &::before {
      content: var(--tw-content);
      --tw-gradient-position: to top;
      @supports (background-image: linear-gradient(in lab, red, red)) {
        --tw-gradient-position: to top in oklab;
      }
      background-image: linear-gradient(var(--tw-gradient-stops));
    }
  }
  .before\:bg-gradient-to-b {
    &::before {
      content: var(--tw-content);
      --tw-gradient-position: to bottom in oklab;
      background-image: linear-gradient(var(--tw-gradient-stops));
    }
  }
  .before\:bg-gradient-to-t {
    &::before {
      content: var(--tw-content);
      --tw-gradient-position: to top in oklab;
      background-image: linear-gradient(var(--tw-gradient-stops));
    }
  }
  .before\:from-transparent {
    &::before {
      content: var(--tw-content);
      --tw-gradient-from: transparent;
      --tw-gradient-stops: var(--tw-gradient-via-stops, var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position));
    }
  }
  .before\:to-background-primary {
    &::before {
      content: var(--tw-content);
      --tw-gradient-to: var(--seq-color-background-primary);
      --tw-gradient-stops: var(--tw-gradient-via-stops, var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position));
    }
  }
  .before\:to-background-primary\/70 {
    &::before {
      content: var(--tw-content);
      --tw-gradient-to: var(--seq-color-background-primary);
      @supports (color: color-mix(in lab, red, red)) {
        --tw-gradient-to: color-mix(in oklab, var(--seq-color-background-primary) 70%, transparent);
      }
      --tw-gradient-stops: var(--tw-gradient-via-stops, var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position));
    }
  }
  .after\:pointer-events-none {
    &::after {
      content: var(--tw-content);
      pointer-events: none;
    }
  }
  .after\:absolute {
    &::after {
      content: var(--tw-content);
      position: absolute;
    }
  }
  .after\:top-0 {
    &::after {
      content: var(--tw-content);
      top: calc(var(--spacing) * 0);
    }
  }
  .after\:right-0 {
    &::after {
      content: var(--tw-content);
      right: calc(var(--spacing) * 0);
    }
  }
  .after\:bottom-0 {
    &::after {
      content: var(--tw-content);
      bottom: calc(var(--spacing) * 0);
    }
  }
  .after\:left-0 {
    &::after {
      content: var(--tw-content);
      left: calc(var(--spacing) * 0);
    }
  }
  .after\:z-10 {
    &::after {
      content: var(--tw-content);
      z-index: 10;
    }
  }
  .after\:hidden {
    &::after {
      content: var(--tw-content);
      display: none;
    }
  }
  .after\:h-4 {
    &::after {
      content: var(--tw-content);
      height: calc(var(--spacing) * 4);
    }
  }
  .after\:h-full {
    &::after {
      content: var(--tw-content);
      height: 100%;
    }
  }
  .after\:w-4 {
    &::after {
      content: var(--tw-content);
      width: calc(var(--spacing) * 4);
    }
  }
  .after\:w-full {
    &::after {
      content: var(--tw-content);
      width: 100%;
    }
  }
  .after\:bg-linear-to-b {
    &::after {
      content: var(--tw-content);
      --tw-gradient-position: to bottom;
      @supports (background-image: linear-gradient(in lab, red, red)) {
        --tw-gradient-position: to bottom in oklab;
      }
      background-image: linear-gradient(var(--tw-gradient-stops));
    }
  }
  .after\:bg-linear-to-r {
    &::after {
      content: var(--tw-content);
      --tw-gradient-position: to right;
      @supports (background-image: linear-gradient(in lab, red, red)) {
        --tw-gradient-position: to right in oklab;
      }
      background-image: linear-gradient(var(--tw-gradient-stops));
    }
  }
  .after\:from-transparent {
    &::after {
      content: var(--tw-content);
      --tw-gradient-from: transparent;
      --tw-gradient-stops: var(--tw-gradient-via-stops, var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position));
    }
  }
  .after\:to-background-primary {
    &::after {
      content: var(--tw-content);
      --tw-gradient-to: var(--seq-color-background-primary);
      --tw-gradient-stops: var(--tw-gradient-via-stops, var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position));
    }
  }
  .last\:mt-0 {
    &:last-child {
      margin-top: calc(var(--spacing) * 0);
    }
  }
  .hover\:animate-bell-ring {
    &:hover {
      @media (hover: hover) {
        animation: var(--animate-bell-ring);
      }
    }
  }
  .hover\:animate-none {
    &:hover {
      @media (hover: hover) {
        animation: none;
      }
    }
  }
  .hover\:border-border-card {
    &:hover {
      @media (hover: hover) {
        border-color: var(--seq-color-border-card);
      }
    }
  }
  .hover\:border-border-hover {
    &:hover {
      @media (hover: hover) {
        border-color: var(--color-border-hover);
      }
    }
  }
  .hover\:bg-background-hover {
    &:hover {
      @media (hover: hover) {
        background-color: var(--seq-color-background-hover);
      }
    }
  }
  .hover\:bg-destructive\/80 {
    &:hover {
      @media (hover: hover) {
        background-color: var(--seq-color-destructive);
        @supports (color: color-mix(in lab, red, red)) {
          background-color: color-mix(in oklab, var(--seq-color-destructive) 80%, transparent);
        }
      }
    }
  }
  .hover\:bg-primary\/15 {
    &:hover {
      @media (hover: hover) {
        background-color: var(--seq-color-primary);
        @supports (color: color-mix(in lab, red, red)) {
          background-color: color-mix(in oklab, var(--seq-color-primary) 15%, transparent);
        }
      }
    }
  }
  .hover\:bg-primary\/80 {
    &:hover {
      @media (hover: hover) {
        background-color: var(--seq-color-primary);
        @supports (color: color-mix(in lab, red, red)) {
          background-color: color-mix(in oklab, var(--seq-color-primary) 80%, transparent);
        }
      }
    }
  }
  .hover\:text-primary\/80 {
    &:hover {
      @media (hover: hover) {
        color: var(--seq-color-primary);
        @supports (color: color-mix(in lab, red, red)) {
          color: color-mix(in oklab, var(--seq-color-primary) 80%, transparent);
        }
      }
    }
  }
  .hover\:text-red-300 {
    &:hover {
      @media (hover: hover) {
        color: var(--color-red-300);
      }
    }
  }
  .hover\:text-text-80 {
    &:hover {
      @media (hover: hover) {
        color: var(--color-text-80);
      }
    }
  }
  .hover\:opacity-50 {
    &:hover {
      @media (hover: hover) {
        opacity: 50%;
      }
    }
  }
  .hover\:opacity-80 {
    &:hover {
      @media (hover: hover) {
        opacity: 80%;
      }
    }
  }
  .hover\:shadow-lg {
    &:hover {
      @media (hover: hover) {
        --tw-shadow: 0 10px 15px -3px var(--tw-shadow-color, rgb(0 0 0 / 0.1)), 0 4px 6px -4px var(--tw-shadow-color, rgb(0 0 0 / 0.1));
        box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);
      }
    }
  }
  .hover\:not-disabled\:not-\[\[aria-invalid\=true\]\]\:not-has-\[\[aria-invalid\=true\]\]\:border-border-hover {
    &:hover {
      @media (hover: hover) {
        &:not(*:disabled) {
          &:not(*:is([aria-invalid=true])) {
            &:not(*:has(*:is([aria-invalid=true]))) {
              border-color: var(--color-border-hover);
            }
          }
        }
      }
    }
  }
  .hover\:not-\[\[data-state\=active\]\]\:opacity-80 {
    &:hover {
      @media (hover: hover) {
        &:not(*:is([data-state=active])) {
          opacity: 80%;
        }
      }
    }
  }
  .focus\:outline-hidden {
    &:focus {
      --tw-outline-style: none;
      outline-style: none;
      @media (forced-colors: active) {
        outline: 2px solid transparent;
        outline-offset: 2px;
      }
    }
  }
  .focus\:outline-none {
    &:focus {
      --tw-outline-style: none;
      outline-style: none;
    }
  }
  .focus-visible\:border-border-focus {
    &:focus-visible {
      border-color: var(--color-border-focus);
    }
  }
  .focus-visible\:shadow-focus-ring {
    &:focus-visible {
      --tw-shadow: 0px 0px 0px 2px var(--tw-shadow-color, hsla(247, 100%, 75%, 1));
      box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);
    }
  }
  .focus-visible\:shadow-none {
    &:focus-visible {
      --tw-shadow: 0 0 #0000;
      box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);
    }
  }
  .focus-visible\:outline-2 {
    &:focus-visible {
      outline-style: var(--tw-outline-style);
      outline-width: 2px;
    }
  }
  .focus-visible\:outline-offset-1 {
    &:focus-visible {
      outline-offset: 1px;
    }
  }
  .focus-visible\:outline-border-focus {
    &:focus-visible {
      outline-color: var(--color-border-focus);
    }
  }
  .active\:border-border-focus {
    &:active {
      border-color: var(--color-border-focus);
    }
  }
  .active\:shadow-active-ring {
    &:active {
      --tw-shadow: 0px 0px 0px 1px var(--tw-shadow-color, hsla(247, 100%, 75%, 1));
      box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);
    }
  }
  .active\:shadow-none {
    &:active {
      --tw-shadow: 0 0 #0000;
      box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);
    }
  }
  .disabled\:pointer-events-none {
    &:disabled {
      pointer-events: none;
    }
  }
  .disabled\:cursor-default {
    &:disabled {
      cursor: default;
    }
  }
  .disabled\:cursor-not-allowed {
    &:disabled {
      cursor: not-allowed;
    }
  }
  .disabled\:opacity-50 {
    &:disabled {
      opacity: 50%;
    }
  }
  .disabled\:opacity-100 {
    &:disabled {
      opacity: 100%;
    }
  }
  .inert\:opacity-0 {
    &:is([inert], [inert] *) {
      opacity: 0%;
    }
  }
  .has-data-\[state\=checked\]\:border-primary {
    &:has(*[data-state="checked"]) {
      border-color: var(--seq-color-primary);
    }
  }
  .has-data-\[state\=checked\]\:bg-primary\/5 {
    &:has(*[data-state="checked"]) {
      background-color: var(--seq-color-primary);
      @supports (color: color-mix(in lab, red, red)) {
        background-color: color-mix(in oklab, var(--seq-color-primary) 5%, transparent);
      }
    }
  }
  .has-\[\:focus-visible\]\:outline-2 {
    &:has(*:is(:focus-visible)) {
      outline-style: var(--tw-outline-style);
      outline-width: 2px;
    }
  }
  .has-\[\:focus-visible\]\:outline-border-focus {
    &:has(*:is(:focus-visible)) {
      outline-color: var(--color-border-focus);
    }
  }
  .has-\[\[aria-invalid\=true\]\]\:border-destructive {
    &:has(*:is([aria-invalid=true])) {
      border-color: var(--seq-color-destructive);
    }
  }
  .has-\[\[aria-invalid\=true\]\]\:outline-destructive {
    &:has(*:is([aria-invalid=true])) {
      outline-color: var(--seq-color-destructive);
    }
  }
  .has-\[\[data-slot\=input-group-control\]\:disabled\]\:pointer-events-none {
    &:has(*:is([data-slot=input-group-control]:disabled)) {
      pointer-events: none;
    }
  }
  .has-\[\[data-slot\=input-group-control\]\:disabled\]\:cursor-not-allowed {
    &:has(*:is([data-slot=input-group-control]:disabled)) {
      cursor: not-allowed;
    }
  }
  .has-\[\[data-slot\=input-group-control\]\:disabled\]\:opacity-50 {
    &:has(*:is([data-slot=input-group-control]:disabled)) {
      opacity: 50%;
    }
  }
  .has-\[\[data-slot\=input-group-control\]\:focus-visible\]\:ring-\[3px\] {
    &:has(*:is([data-slot=input-group-control]:focus-visible)) {
      --tw-ring-shadow: var(--tw-ring-inset,) 0 0 0 calc(3px + var(--tw-ring-offset-width)) var(--tw-ring-color, currentcolor);
      box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);
    }
  }
  .has-\[\[data-slot\]\[aria-invalid\=true\]\]\:border-destructive {
    &:has(*:is([data-slot][aria-invalid=true])) {
      border-color: var(--seq-color-destructive);
    }
  }
  .has-\[\[data-slot\]\[aria-invalid\=true\]\]\:outline-destructive {
    &:has(*:is([data-slot][aria-invalid=true])) {
      outline-color: var(--seq-color-destructive);
    }
  }
  .has-\[\>\[data-align\=block-end\]\]\:h-auto {
    &:has(>[data-align=block-end]) {
      height: auto;
    }
  }
  .has-\[\>\[data-align\=block-end\]\]\:flex-col {
    &:has(>[data-align=block-end]) {
      flex-direction: column;
    }
  }
  .has-\[\>\[data-align\=block-start\]\]\:h-auto {
    &:has(>[data-align=block-start]) {
      height: auto;
    }
  }
  .has-\[\>\[data-align\=block-start\]\]\:flex-col {
    &:has(>[data-align=block-start]) {
      flex-direction: column;
    }
  }
  .has-\[\>\[data-slot\=checkbox-group\]\]\:gap-3 {
    &:has(>[data-slot=checkbox-group]) {
      gap: calc(var(--spacing) * 3);
    }
  }
  .has-\[\>\[data-slot\=field-content\]\]\:items-start {
    &:has(>[data-slot=field-content]) {
      align-items: flex-start;
    }
  }
  .has-\[\>\[data-slot\=field\]\]\:w-full {
    &:has(>[data-slot=field]) {
      width: 100%;
    }
  }
  .has-\[\>\[data-slot\=field\]\]\:flex-col {
    &:has(>[data-slot=field]) {
      flex-direction: column;
    }
  }
  .has-\[\>\[data-slot\=field\]\]\:rounded-md {
    &:has(>[data-slot=field]) {
      border-radius: var(--radius-md);
    }
  }
  .has-\[\>\[data-slot\=field\]\]\:border {
    &:has(>[data-slot=field]) {
      border-style: var(--tw-border-style);
      border-width: 1px;
    }
  }
  .has-\[\>\[data-slot\=radio-group\]\]\:gap-3 {
    &:has(>[data-slot=radio-group]) {
      gap: calc(var(--spacing) * 3);
    }
  }
  .has-\[\>textarea\]\:h-auto {
    &:has(>textarea) {
      height: auto;
    }
  }
  .aria-invalid\:border-destructive {
    &[aria-invalid="true"] {
      border-color: var(--seq-color-destructive);
    }
  }
  .aria-invalid\:outline-destructive {
    &[aria-invalid="true"] {
      outline-color: var(--seq-color-destructive);
    }
  }
  .data-disabled\:pointer-events-none {
    &[data-disabled] {
      pointer-events: none;
    }
  }
  .data-disabled\:cursor-default {
    &[data-disabled] {
      cursor: default;
    }
  }
  .data-disabled\:text-muted {
    &[data-disabled] {
      color: var(--seq-color-muted);
    }
  }
  .data-disabled\:opacity-50 {
    &[data-disabled] {
      opacity: 50%;
    }
  }
  .data-disabled\:opacity-80 {
    &[data-disabled] {
      opacity: 80%;
    }
  }
  .data-highlighted\:bg-background-active\/33 {
    &[data-highlighted] {
      background-color: var(--seq-color-background-active);
      @supports (color: color-mix(in lab, red, red)) {
        background-color: color-mix(in oklab, var(--seq-color-background-active) 33%, transparent);
      }
    }
  }
  .data-highlighted\:bg-background-hover {
    &[data-highlighted] {
      background-color: var(--seq-color-background-hover);
    }
  }
  .data-\[disabled\]\:pointer-events-none {
    &[data-disabled] {
      pointer-events: none;
    }
  }
  .data-\[disabled\]\:opacity-50 {
    &[data-disabled] {
      opacity: 50%;
    }
  }
  .data-\[invalid\=true\]\:text-destructive {
    &[data-invalid="true"] {
      color: var(--seq-color-destructive);
    }
  }
  .data-\[orientation\=horizontal\]\:h-px {
    &[data-orientation="horizontal"] {
      height: 1px;
    }
  }
  .data-\[orientation\=horizontal\]\:w-full {
    &[data-orientation="horizontal"] {
      width: 100%;
    }
  }
  .data-\[orientation\=vertical\]\:h-full {
    &[data-orientation="vertical"] {
      height: 100%;
    }
  }
  .data-\[orientation\=vertical\]\:w-px {
    &[data-orientation="vertical"] {
      width: 1px;
    }
  }
  .data-\[side\=bottom\]\:slide-in-from-top-2 {
    &[data-side="bottom"] {
      --tw-enter-translate-y: calc(2*var(--spacing)*-1);
    }
  }
  .data-\[side\=left\]\:slide-in-from-right-2 {
    &[data-side="left"] {
      --tw-enter-translate-x: calc(2*var(--spacing));
    }
  }
  .data-\[side\=right\]\:slide-in-from-left-2 {
    &[data-side="right"] {
      --tw-enter-translate-x: calc(2*var(--spacing)*-1);
    }
  }
  .data-\[side\=top\]\:slide-in-from-bottom-2 {
    &[data-side="top"] {
      --tw-enter-translate-y: calc(2*var(--spacing));
    }
  }
  .data-\[slot\=checkbox-group\]\:gap-3 {
    &[data-slot="checkbox-group"] {
      gap: calc(var(--spacing) * 3);
    }
  }
  .data-\[state\=active\]\:border-border-focus {
    &[data-state="active"] {
      border-color: var(--color-border-focus);
    }
  }
  .data-\[state\=active\]\:text-border-focus {
    &[data-state="active"] {
      color: var(--color-border-focus);
    }
  }
  .data-\[state\=active\]\:text-primary {
    &[data-state="active"] {
      color: var(--seq-color-primary);
    }
  }
  .data-\[state\=checked\]\:translate-x-full {
    &[data-state="checked"] {
      --tw-translate-x: 100%;
      translate: var(--tw-translate-x) var(--tw-translate-y);
    }
  }
  .data-\[state\=checked\]\:border-transparent\! {
    &[data-state="checked"] {
      border-color: transparent !important;
    }
  }
  .data-\[state\=checked\]\:bg-background-active {
    &[data-state="checked"] {
      background-color: var(--seq-color-background-active);
    }
  }
  .data-\[state\=checked\]\:bg-white {
    &[data-state="checked"] {
      background-color: var(--color-white);
    }
  }
  .data-\[state\=checked\]\:bg-gradient-primary {
    &[data-state="checked"] {
      background-image: var(--seq-color-gradient-primary);
    }
  }
  .data-\[state\=closed\]\:animate-out {
    &[data-state="closed"] {
      animation: exit var(--tw-animation-duration,var(--tw-duration,.15s))var(--tw-ease,ease)var(--tw-animation-delay,0s)var(--tw-animation-iteration-count,1)var(--tw-animation-direction,normal)var(--tw-animation-fill-mode,none);
    }
  }
  .data-\[state\=closed\]\:duration-300 {
    &[data-state="closed"] {
      --tw-duration: 300ms;
      transition-duration: 300ms;
    }
  }
  .data-\[state\=closed\]\:fade-out-0 {
    &[data-state="closed"] {
      --tw-exit-opacity: calc(0/100);
      --tw-exit-opacity: 0;
    }
  }
  .data-\[state\=closed\]\:zoom-out-95 {
    &[data-state="closed"] {
      --tw-exit-scale: calc(95*1%);
      --tw-exit-scale: .95;
    }
  }
  .data-\[state\=closed\]\:slide-out-to-bottom {
    &[data-state="closed"] {
      --tw-exit-translate-y: 100%;
    }
  }
  .data-\[state\=closed\]\:slide-out-to-left {
    &[data-state="closed"] {
      --tw-exit-translate-x: -100%;
    }
  }
  .data-\[state\=closed\]\:slide-out-to-right {
    &[data-state="closed"] {
      --tw-exit-translate-x: 100%;
    }
  }
  .data-\[state\=closed\]\:slide-out-to-top {
    &[data-state="closed"] {
      --tw-exit-translate-y: -100%;
    }
  }
  .data-\[state\=open\]\:animate-in {
    &[data-state="open"] {
      animation: enter var(--tw-animation-duration,var(--tw-duration,.15s))var(--tw-ease,ease)var(--tw-animation-delay,0s)var(--tw-animation-iteration-count,1)var(--tw-animation-direction,normal)var(--tw-animation-fill-mode,none);
    }
  }
  .data-\[state\=open\]\:duration-500 {
    &[data-state="open"] {
      --tw-duration: 500ms;
      transition-duration: 500ms;
    }
  }
  .data-\[state\=open\]\:fade-in-0 {
    &[data-state="open"] {
      --tw-enter-opacity: calc(0/100);
      --tw-enter-opacity: 0;
    }
  }
  .data-\[state\=open\]\:zoom-in-95 {
    &[data-state="open"] {
      --tw-enter-scale: calc(95*1%);
      --tw-enter-scale: .95;
    }
  }
  .data-\[state\=open\]\:slide-in-from-bottom {
    &[data-state="open"] {
      --tw-enter-translate-y: 100%;
    }
  }
  .data-\[state\=open\]\:slide-in-from-left {
    &[data-state="open"] {
      --tw-enter-translate-x: -100%;
    }
  }
  .data-\[state\=open\]\:slide-in-from-right {
    &[data-state="open"] {
      --tw-enter-translate-x: 100%;
    }
  }
  .data-\[state\=open\]\:slide-in-from-top {
    &[data-state="open"] {
      --tw-enter-translate-y: -100%;
    }
  }
  .data-\[swipe\=cancel\]\:translate-x-0 {
    &[data-swipe="cancel"] {
      --tw-translate-x: calc(var(--spacing) * 0);
      translate: var(--tw-translate-x) var(--tw-translate-y);
    }
  }
  .data-\[swipe\=cancel\]\:transition-transform {
    &[data-swipe="cancel"] {
      transition-property: transform, translate, scale, rotate;
      transition-timing-function: var(--tw-ease, var(--default-transition-timing-function));
      transition-duration: var(--tw-duration, var(--default-transition-duration));
    }
  }
  .data-\[swipe\=cancel\]\:duration-200 {
    &[data-swipe="cancel"] {
      --tw-duration: 200ms;
      transition-duration: 200ms;
    }
  }
  .data-\[swipe\=cancel\]\:ease-out {
    &[data-swipe="cancel"] {
      --tw-ease: var(--ease-out);
      transition-timing-function: var(--ease-out);
    }
  }
  .data-\[swipe\=end\]\:animate-swipe-out {
    &[data-swipe="end"] {
      animation: swipe-out 200ms ease-out;
    }
  }
  .data-\[swipe\=move\]\:translate-x-\[var\(--radix-toast-swipe-move-x\)\] {
    &[data-swipe="move"] {
      --tw-translate-x: var(--radix-toast-swipe-move-x);
      translate: var(--tw-translate-x) var(--tw-translate-y);
    }
  }
  .nth-last-2\:-mt-1 {
    &:nth-last-child(2) {
      margin-top: calc(var(--spacing) * -1);
    }
  }
  .sm\:max-w-lg {
    @media (width >= 40rem) {
      max-width: var(--container-lg);
    }
  }
  .sm\:max-w-sm {
    @media (width >= 40rem) {
      max-width: var(--container-sm);
    }
  }
  .sm\:flex-row {
    @media (width >= 40rem) {
      flex-direction: row;
    }
  }
  .sm\:justify-end {
    @media (width >= 40rem) {
      justify-content: flex-end;
    }
  }
  .sm\:text-left {
    @media (width >= 40rem) {
      text-align: left;
    }
  }
  .md\:bottom-auto {
    @media (width >= 48rem) {
      bottom: auto;
    }
  }
  .md\:h-\[800px\] {
    @media (width >= 48rem) {
      height: 800px;
    }
  }
  .md\:max-h-\[min\(800px\,calc\(100dvh-80px\)\)\] {
    @media (width >= 48rem) {
      max-height: min(800px, calc(100dvh - 80px));
    }
  }
  .md\:w-\[540px\] {
    @media (width >= 48rem) {
      width: 540px;
    }
  }
  .md\:w-\[720px\] {
    @media (width >= 48rem) {
      width: 720px;
    }
  }
  .md\:rounded-b-2xl {
    @media (width >= 48rem) {
      border-bottom-right-radius: var(--radius-2xl);
      border-bottom-left-radius: var(--radius-2xl);
    }
  }
  .lg\:h-auto\! {
    @media (width >= 64rem) {
      height: auto !important;
    }
  }
  .\@md\/field-group\:flex-row {
    @container field-group (width >= 28rem) {
      flex-direction: row;
    }
  }
  .\@md\/field-group\:items-center {
    @container field-group (width >= 28rem) {
      align-items: center;
    }
  }
  .\@md\/field-group\:has-\[\>\[data-slot\=field-content\]\]\:items-start {
    @container field-group (width >= 28rem) {
      &:has(>[data-slot=field-content]) {
        align-items: flex-start;
      }
    }
  }
  .\[\&_span\]\:size-\[12px\] {
    & span {
      width: 12px;
      height: 12px;
    }
  }
  .\[\&_span\]\:size-\[18px\] {
    & span {
      width: 18px;
      height: 18px;
    }
  }
  .\[\&_svg\]\:pointer-events-none {
    & svg {
      pointer-events: none;
    }
  }
  .\[\&_svg\:not\(\[class\*\=\"size-\"\]\)\]\:size-4 {
    & svg:not([class*="size-"]) {
      width: calc(var(--spacing) * 4);
      height: calc(var(--spacing) * 4);
    }
  }
  .\[\&_svg\:not\(\[class\*\=\"size-\"\]\)\]\:size-5 {
    & svg:not([class*="size-"]) {
      width: calc(var(--spacing) * 5);
      height: calc(var(--spacing) * 5);
    }
  }
  .\[\&\:focus\]\:rounded-\[10px\] {
    &:focus {
      border-radius: 10px;
    }
  }
  .\[\&\:focus\]\:outline-\[3px\] {
    &:focus {
      outline-style: var(--tw-outline-style);
      outline-width: 3px;
    }
  }
  .\[\&\:focus\]\:outline-offset-\[-3px\] {
    &:focus {
      outline-offset: -3px;
    }
  }
  .\[\&\:focus\]\:outline-black {
    &:focus {
      outline-color: var(--color-black);
    }
  }
  .\[\&\:has\(\:disabled\)\]\:cursor-default {
    &:has(:disabled) {
      cursor: default;
    }
  }
  .\[\&\:has\(\:disabled\)\]\:opacity-50 {
    &:has(:disabled) {
      opacity: 50%;
    }
  }
  .\[\&\:has\(div\:nth-child\(4\)\)\>div\]\:col-\[unset\] {
    &:has(div:nth-child(4))>div {
      grid-column: unset;
    }
  }
  .\[\.border-b\]\:pb-3 {
    &:is(.border-b) {
      padding-bottom: calc(var(--spacing) * 3);
    }
  }
  .\[\.border-t\]\:pt-3 {
    &:is(.border-t) {
      padding-top: calc(var(--spacing) * 3);
    }
  }
  .\[\&\>\*\]\:w-full {
    &>* {
      width: 100%;
    }
  }
  .\[\&\>\*\]\:data-\[slot\=field\]\:p-4 {
    &>* {
      &[data-slot="field"] {
        padding: calc(var(--spacing) * 4);
      }
    }
  }
  .\@md\/field-group\:\[\&\>\*\]\:w-auto {
    @container field-group (width >= 28rem) {
      &>* {
        width: auto;
      }
    }
  }
  .\[\&\>\.sr-only\]\:w-auto {
    &>.sr-only {
      width: auto;
    }
  }
  .\[\&\>\[data-slot\=field-group\]\]\:gap-4 {
    &>[data-slot=field-group] {
      gap: calc(var(--spacing) * 4);
    }
  }
  .\[\&\>\[data-slot\=field-label\]\]\:flex-auto {
    &>[data-slot=field-label] {
      flex: auto;
    }
  }
  .\@md\/field-group\:\[\&\>\[data-slot\=field-label\]\]\:flex-auto {
    @container field-group (width >= 28rem) {
      &>[data-slot=field-label] {
        flex: auto;
      }
    }
  }
  .has-\[\>\[data-slot\=field-content\]\]\:\[\&\>\[role\=checkbox\]\,\[role\=radio\]\]\:mt-px {
    &:has(>[data-slot=field-content]) {
      &>[role=checkbox],[role=radio] {
        margin-top: 1px;
      }
    }
  }
  .\@md\/field-group\:has-\[\>\[data-slot\=field-content\]\]\:\[\&\>\[role\=checkbox\]\,\[role\=radio\]\]\:mt-px {
    @container field-group (width >= 28rem) {
      &:has(>[data-slot=field-content]) {
        &>[role=checkbox],[role=radio] {
          margin-top: 1px;
        }
      }
    }
  }
  .\[\&\>a\]\:underline {
    &>a {
      text-decoration-line: underline;
    }
  }
  .\[\&\>a\]\:underline-offset-4 {
    &>a {
      text-underline-offset: 4px;
    }
  }
  .\[\&\>a\:hover\]\:text-primary {
    &>a:hover {
      color: var(--seq-color-primary);
    }
  }
  .\[\&\>div\]\:justify-center {
    &>div {
      justify-content: center;
    }
  }
  .\[\&\>div\:nth-child\(1\)\:only-child\]\:h-\[312px\] {
    &>div:nth-child(1):only-child {
      height: 312px;
    }
  }
  .\[\&\>div\:nth-child\(1\)\:only-child\]\:w-\[312px\] {
    &>div:nth-child(1):only-child {
      width: 312px;
    }
  }
  .\[\&\>div\:nth-child\(3\)\]\:col-\[1\/-1\] {
    &>div:nth-child(3) {
      grid-column: 1/-1;
    }
  }
  .\[\&\>div\:nth-child\(3\)\]\:justify-self-center {
    &>div:nth-child(3) {
      justify-self: center;
    }
  }
  .\[\&\>input\]\:text-xs {
    &>input {
      font-size: var(--text-xs);
      line-height: var(--tw-leading, var(--text-xs--line-height));
    }
  }
  .has-\[\>\[data-align\=block-end\]\]\:\[\&\>input\]\:pt-3 {
    &:has(>[data-align=block-end]) {
      &>input {
        padding-top: calc(var(--spacing) * 3);
      }
    }
  }
  .has-\[\>\[data-align\=block-start\]\]\:\[\&\>input\]\:pb-3 {
    &:has(>[data-align=block-start]) {
      &>input {
        padding-bottom: calc(var(--spacing) * 3);
      }
    }
  }
  .has-\[\>\[data-align\=inline-end\]\]\:\[\&\>input\]\:pr-2 {
    &:has(>[data-align=inline-end]) {
      &>input {
        padding-right: calc(var(--spacing) * 2);
      }
    }
  }
  .has-\[\>\[data-align\=inline-start\]\]\:\[\&\>input\]\:pl-2 {
    &:has(>[data-align=inline-start]) {
      &>input {
        padding-left: calc(var(--spacing) * 2);
      }
    }
  }
  .\[\&\>label\]\:flex {
    &>label {
      display: flex;
    }
  }
  .\[\&\>label\]\:w-16 {
    &>label {
      width: calc(var(--spacing) * 16);
    }
  }
  .\[\&\>label\]\:w-full {
    &>label {
      width: 100%;
    }
  }
  .\[\&\>label\]\:gap-1 {
    &>label {
      gap: calc(var(--spacing) * 1);
    }
  }
  .\[\&\>label\]\:gap-\[2px\] {
    &>label {
      gap: 2px;
    }
  }
  .\[\&\>label\>button\]\:w-full {
    &>label>button {
      width: 100%;
    }
  }
  .\[\&\>label\>button\]\:text-xs {
    &>label>button {
      font-size: var(--text-xs);
      line-height: var(--tw-leading, var(--text-xs--line-height));
    }
  }
  .\[\&\>label\>button\>span\]\:overflow-hidden {
    &>label>button>span {
      overflow: hidden;
    }
  }
  .\[\&\>label\>div\]\:w-full {
    &>label>div {
      width: 100%;
    }
  }
  .\[\&\>label\>div\>div\>div\]\:h-9 {
    &>label>div>div>div {
      height: calc(var(--spacing) * 9);
    }
  }
  .\[\&\>label\>div\>div\>div\]\:h-13 {
    &>label>div>div>div {
      height: calc(var(--spacing) * 13);
    }
  }
  .\[\&\>label\>div\>div\>div\]\:rounded {
    &>label>div>div>div {
      border-radius: 0.25rem;
    }
  }
  .\[\&\>label\>div\>div\>div\]\:rounded-xl {
    &>label>div>div>div {
      border-radius: var(--radius-xl);
    }
  }
  .\[\&\>label\>div\>div\>div\]\:pr-0 {
    &>label>div>div>div {
      padding-right: calc(var(--spacing) * 0);
    }
  }
  .\[\&\>label\>div\>div\>div\]\:pl-3 {
    &>label>div>div>div {
      padding-left: calc(var(--spacing) * 3);
    }
  }
  .\[\&\>label\>div\>div\>div\]\:text-xs {
    &>label>div>div>div {
      font-size: var(--text-xs);
      line-height: var(--tw-leading, var(--text-xs--line-height));
    }
  }
  .\[\&\>label\>div\>div\>div\:has\(\:disabled\)\]\:opacity-100 {
    &>label>div>div>div:has(:disabled) {
      opacity: 100%;
    }
  }
  .\[\&\>label\>div\>div\>div\:has\(\:disabled\)\:hover\]\:opacity-100 {
    &>label>div>div>div:has(:disabled):hover {
      opacity: 100%;
    }
  }
  .\[\&\>label\>div\>div\>div\>input\]\:text-sm {
    &>label>div>div>div>input {
      font-size: var(--text-sm);
      line-height: var(--tw-leading, var(--text-sm--line-height));
    }
  }
  .\[\&\>label\>div\>div\>div\>input\]\:text-xs {
    &>label>div>div>div>input {
      font-size: var(--text-xs);
      line-height: var(--tw-leading, var(--text-xs--line-height));
    }
  }
  .\[\&\>label\>div\>div\>span\]\:text-sm {
    &>label>div>div>span {
      font-size: var(--text-sm);
      line-height: var(--tw-leading, var(--text-sm--line-height));
    }
  }
  .\[\&\>label\>div\>div\>span\]\:text-text-80 {
    &>label>div>div>span {
      color: var(--color-text-80);
    }
  }
  .\[\&\>span\[data-state\=\'checked\'\]\]\:hidden {
    &>span[data-state='checked'] {
      display: none;
    }
  }
  .\[\&\>svg\]\:stroke-2 {
    &>svg {
      stroke-width: 2;
    }
  }
  .\[\&\>svg\]\:stroke-\[calc\(24\/16\*2px\)\] {
    &>svg {
      stroke-width: calc(24 / 16 * 2px);
    }
  }
  .\[\&\>svg\]\:stroke-\[calc\(24\/32\*2px\)\] {
    &>svg {
      stroke-width: calc(24 / 32 * 2px);
    }
  }
  .\[\[data-variant\=legend\]\+\&\]\:-mt-1\.5 {
    [data-variant=legend]+& {
      margin-top: calc(var(--spacing) * -1.5);
    }
  }
}
@property --tw-animation-duration {
  syntax: "*";
  inherits: false;
}
:root, [data-theme=dark] {
  --seq-color-positive: var(--color-green-500);
  --seq-color-negative: var(--color-red-500);
  --seq-color-info: var(--color-blue-500);
  --seq-color-warning: var(--color-yellow-500);
  --seq-color-destructive: var(--color-red-500);
  --seq-color-primary: white;
  --seq-color-secondary: white;
  --seq-color-muted: var(--color-zinc-500);
  --seq-color-inverse: black;
  --seq-color-background-primary: black;
  --seq-color-background-secondary: var(--color-zinc-900);
  --seq-color-background-muted: var(--color-zinc-950);
  --seq-color-background-inverse: white;
  --seq-color-background-overlay: color-mix( in oklab, oklch(37% 0.013 285.805) 90%, transparent );
  @supports (color: color-mix(in lab, red, red)) {
    --seq-color-background-overlay: color-mix( in oklab, var(--color-zinc-700) 90%, transparent );
  }
  --seq-color-background-raised: var(--color-zinc-800);
  --seq-color-background-input: var(--color-zinc-950);
  --seq-color-background-hover: var(--color-zinc-900);
  --seq-color-background-active: var(--color-zinc-700);
  --seq-color-border-normal: var(--color-zinc-700);
  --seq-color-border-hover: var(--color-zinc-600);
  --seq-color-border-focus: var(--color-violet-500);
  --seq-color-border-card: var(--color-zinc-800);
  --seq-color-border-button: var(--color-zinc-700);
  --seq-color-drop-shadow: color-mix( in oklab, oklch(14.1% 0.005 285.823) 40%, transparent );
  @supports (color: color-mix(in lab, red, red)) {
    --seq-color-drop-shadow: color-mix( in oklab, var(--color-zinc-950) 40%, transparent );
  }
  --seq-color-gradient-backdrop: linear-gradient(
      
      243.18deg,
      rgba(86, 52, 189, 0.85) 0%,
      rgba(49, 41, 223, 0.85) 63.54%,
      rgba(7, 98, 149, 0.85) 100% );
  --seq-color-gradient-primary: linear-gradient(
      
      89.69deg,
      #4411e1 0.27%,
      #7537f9 99.73% );
  --seq-color-gradient-secondary: linear-gradient(
      
      32.51deg,
      #951990 -15.23%,
      #3a35b1 48.55%,
      #20a8b0 100% );
  --seq-color-gradient-skeleton: linear-gradient(
      
      -45deg,
      transparent,
      var(--color-zinc-700),
      transparent );
}
[data-theme=light] {
  --seq-color-positive: var(--color-green-600);
  --seq-color-negative: var(--color-red-600);
  --seq-color-info: var(--color-blue-600);
  --seq-color-warning: var(--color-yellow-600);
  --seq-color-destructive: var(--color-red-600);
  --seq-color-primary: var(--color-slate-800);
  --seq-color-secondary: var(--color-slate-800);
  --seq-color-muted: var(--color-slate-500);
  --seq-color-inverse: var(--color-slate-50);
  --seq-color-background-primary: var(--color-slate-50);
  --seq-color-background-secondary: white;
  --seq-color-background-muted: var(--color-slate-100);
  --seq-color-background-inverse: black;
  --seq-color-background-overlay: color-mix( in oklab, oklch(86.9% 0.022 252.894) 80%, transparent );
  @supports (color: color-mix(in lab, red, red)) {
    --seq-color-background-overlay: color-mix( in oklab, var(--color-slate-300) 80%, transparent );
  }
  --seq-color-background-raised: white;
  --seq-color-background-input: var(--color-slate-50);
  --seq-color-background-hover: var(--color-slate-100);
  --seq-color-background-active: var(--color-slate-200);
  --seq-color-border-normal: var(--color-slate-300);
  --seq-color-border-hover: var(--color-slate-400);
  --seq-color-border-focus: var(--color-violet-600);
  --seq-color-border-card: var(--color-slate-200);
  --seq-color-border-button: var(--color-slate-300);
  --seq-color-drop-shadow: color-mix( in oklab, oklch(12.9% 0.042 264.695) 15%, transparent );
  @supports (color: color-mix(in lab, red, red)) {
    --seq-color-drop-shadow: color-mix( in oklab, var(--color-slate-950) 15%, transparent );
  }
  --seq-color-gradient-backdrop: linear-gradient(
      
      243.18deg,
      rgba(86, 52, 189, 0.85) 0%,
      rgba(49, 41, 223, 0.85) 63.54%,
      rgba(7, 98, 149, 0.85) 100% );
  --seq-color-gradient-primary: linear-gradient(
      
      89.69deg,
      #4411e1 0.27%,
      #7537f9 99.73% );
  --seq-color-gradient-secondary: linear-gradient(
      
      32.51deg,
      #951990 -15.23%,
      #3a35b1 48.55%,
      #20a8b0 100% );
  --seq-color-gradient-skeleton: linear-gradient(
      
      -45deg,
      transparent,
      var(--color-slate-300),
      transparent );
}
:root {
  --base-unit: 16;
}
.rdp-root {
  --rdp-accent-color: blue;
  --rdp-accent-background-color: #f0f0ff;
  --rdp-day-height: 44px;
  --rdp-day-width: 44px;
  --rdp-day_button-border-radius: 100%;
  --rdp-day_button-border: 2px solid transparent;
  --rdp-day_button-height: 42px;
  --rdp-day_button-width: 42px;
  --rdp-selected-border: 2px solid var(--rdp-accent-color);
  --rdp-disabled-opacity: 0.5;
  --rdp-outside-opacity: 0.75;
  --rdp-today-color: var(--rdp-accent-color);
  --rdp-dropdown-gap: 0.5rem;
  --rdp-months-gap: 2rem;
  --rdp-nav_button-disabled-opacity: 0.5;
  --rdp-nav_button-height: 2.25rem;
  --rdp-nav_button-width: 2.25rem;
  --rdp-nav-height: 2.75rem;
  --rdp-range_middle-background-color: var(--rdp-accent-background-color);
  --rdp-range_middle-color: inherit;
  --rdp-range_start-color: white;
  --rdp-range_start-background: linear-gradient(
    var(--rdp-gradient-direction),
    transparent 50%,
    var(--rdp-range_middle-background-color) 50%
  );
  --rdp-range_start-date-background-color: var(--rdp-accent-color);
  --rdp-range_end-background: linear-gradient(
    var(--rdp-gradient-direction),
    var(--rdp-range_middle-background-color) 50%,
    transparent 50%
  );
  --rdp-range_end-color: white;
  --rdp-range_end-date-background-color: var(--rdp-accent-color);
  --rdp-week_number-border-radius: 100%;
  --rdp-week_number-border: 2px solid transparent;
  --rdp-week_number-height: var(--rdp-day-height);
  --rdp-week_number-opacity: 0.75;
  --rdp-week_number-width: var(--rdp-day-width);
  --rdp-weeknumber-text-align: center;
  --rdp-weekday-opacity: 0.75;
  --rdp-weekday-padding: 0.5rem 0rem;
  --rdp-weekday-text-align: center;
  --rdp-gradient-direction: 90deg;
  --rdp-animation_duration: 0.3s;
  --rdp-animation_timing: cubic-bezier(0.4, 0, 0.2, 1);
}
.rdp-root[dir="rtl"] {
  --rdp-gradient-direction: -90deg;
}
.rdp-root[data-broadcast-calendar="true"] {
  --rdp-outside-opacity: unset;
}
.rdp-root {
  position: relative;
  box-sizing: border-box;
}
.rdp-root * {
  box-sizing: border-box;
}
.rdp-day {
  width: var(--rdp-day-width);
  height: var(--rdp-day-height);
  text-align: center;
}
.rdp-day_button {
  background: none;
  padding: 0;
  margin: 0;
  cursor: pointer;
  font: inherit;
  color: inherit;
  justify-content: center;
  align-items: center;
  display: flex;
  width: var(--rdp-day_button-width);
  height: var(--rdp-day_button-height);
  border: var(--rdp-day_button-border);
  border-radius: var(--rdp-day_button-border-radius);
}
.rdp-day_button:disabled {
  cursor: revert;
}
.rdp-caption_label {
  z-index: 1;
  position: relative;
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
  border: 0;
}
.rdp-dropdown:focus-visible ~ .rdp-caption_label {
  outline: 5px auto Highlight;
  outline: 5px auto -webkit-focus-ring-color;
}
.rdp-button_next, .rdp-button_previous {
  border: none;
  background: none;
  padding: 0;
  margin: 0;
  cursor: pointer;
  font: inherit;
  color: inherit;
  -moz-appearance: none;
  -webkit-appearance: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
  appearance: none;
  width: var(--rdp-nav_button-width);
  height: var(--rdp-nav_button-height);
}
.rdp-button_next:disabled, .rdp-button_next[aria-disabled="true"], .rdp-button_previous:disabled, .rdp-button_previous[aria-disabled="true"] {
  cursor: revert;
  opacity: var(--rdp-nav_button-disabled-opacity);
}
.rdp-chevron {
  display: inline-block;
  fill: var(--rdp-accent-color);
}
.rdp-root[dir="rtl"] .rdp-nav .rdp-chevron {
  transform: rotate(180deg);
  transform-origin: 50%;
}
.rdp-dropdowns {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: var(--rdp-dropdown-gap);
}
.rdp-dropdown {
  z-index: 2;
  opacity: 0;
  appearance: none;
  position: absolute;
  inset-block-start: 0;
  inset-block-end: 0;
  inset-inline-start: 0;
  width: 100%;
  margin: 0;
  padding: 0;
  cursor: inherit;
  border: none;
  line-height: inherit;
}
.rdp-dropdown_root {
  position: relative;
  display: inline-flex;
  align-items: center;
}
.rdp-dropdown_root[data-disabled="true"] .rdp-chevron {
  opacity: var(--rdp-disabled-opacity);
}
.rdp-month_caption {
  display: flex;
  align-content: center;
  height: var(--rdp-nav-height);
  font-weight: bold;
  font-size: large;
}
.rdp-root[data-nav-layout="around"] .rdp-month, .rdp-root[data-nav-layout="after"] .rdp-month {
  position: relative;
}
.rdp-root[data-nav-layout="around"] .rdp-month_caption {
  justify-content: center;
  margin-inline-start: var(--rdp-nav_button-width);
  margin-inline-end: var(--rdp-nav_button-width);
  position: relative;
}
.rdp-root[data-nav-layout="around"] .rdp-button_previous {
  position: absolute;
  inset-inline-start: 0;
  top: 0;
  height: var(--rdp-nav-height);
  display: inline-flex;
}
.rdp-root[data-nav-layout="around"] .rdp-button_next {
  position: absolute;
  inset-inline-end: 0;
  top: 0;
  height: var(--rdp-nav-height);
  display: inline-flex;
  justify-content: center;
}
.rdp-months {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  gap: var(--rdp-months-gap);
  max-width: fit-content;
}
.rdp-month_grid {
  border-collapse: collapse;
}
.rdp-nav {
  position: absolute;
  inset-block-start: 0;
  inset-inline-end: 0;
  display: flex;
  align-items: center;
  height: var(--rdp-nav-height);
}
.rdp-weekday {
  opacity: var(--rdp-weekday-opacity);
  padding: var(--rdp-weekday-padding);
  font-weight: 500;
  font-size: smaller;
  text-align: var(--rdp-weekday-text-align);
  text-transform: var(--rdp-weekday-text-transform);
}
.rdp-week_number {
  opacity: var(--rdp-week_number-opacity);
  font-weight: 400;
  font-size: small;
  height: var(--rdp-week_number-height);
  width: var(--rdp-week_number-width);
  border: var(--rdp-week_number-border);
  border-radius: var(--rdp-week_number-border-radius);
  text-align: var(--rdp-weeknumber-text-align);
}
.rdp-today:not(.rdp-outside) {
  color: var(--rdp-today-color);
}
.rdp-selected {
  font-weight: bold;
  font-size: large;
}
.rdp-selected .rdp-day_button {
  border: var(--rdp-selected-border);
}
.rdp-outside {
  opacity: var(--rdp-outside-opacity);
}
.rdp-disabled {
  opacity: var(--rdp-disabled-opacity);
}
.rdp-hidden {
  visibility: hidden;
  color: var(--rdp-range_start-color);
}
.rdp-range_start {
  background: var(--rdp-range_start-background);
}
.rdp-range_start .rdp-day_button {
  background-color: var(--rdp-range_start-date-background-color);
  color: var(--rdp-range_start-color);
}
.rdp-range_middle {
  background-color: var(--rdp-range_middle-background-color);
}
.rdp-range_middle .rdp-day_button {
  border: unset;
  border-radius: unset;
  color: var(--rdp-range_middle-color);
}
.rdp-range_end {
  background: var(--rdp-range_end-background);
  color: var(--rdp-range_end-color);
}
.rdp-range_end .rdp-day_button {
  color: var(--rdp-range_start-color);
  background-color: var(--rdp-range_end-date-background-color);
}
.rdp-range_start.rdp-range_end {
  background: revert;
}
.rdp-focusable {
  cursor: pointer;
}
@keyframes rdp-slide_in_left {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(0);
  }
}
@keyframes rdp-slide_in_right {
  0% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(0);
  }
}
@keyframes rdp-slide_out_left {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-100%);
  }
}
@keyframes rdp-slide_out_right {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(100%);
  }
}
.rdp-weeks_before_enter {
  animation: rdp-slide_in_left var(--rdp-animation_duration) var(--rdp-animation_timing) forwards;
}
.rdp-weeks_before_exit {
  animation: rdp-slide_out_left var(--rdp-animation_duration) var(--rdp-animation_timing) forwards;
}
.rdp-weeks_after_enter {
  animation: rdp-slide_in_right var(--rdp-animation_duration) var(--rdp-animation_timing) forwards;
}
.rdp-weeks_after_exit {
  animation: rdp-slide_out_right var(--rdp-animation_duration) var(--rdp-animation_timing) forwards;
}
.rdp-root[dir="rtl"] .rdp-weeks_after_enter {
  animation: rdp-slide_in_left var(--rdp-animation_duration) var(--rdp-animation_timing) forwards;
}
.rdp-root[dir="rtl"] .rdp-weeks_before_exit {
  animation: rdp-slide_out_right var(--rdp-animation_duration) var(--rdp-animation_timing) forwards;
}
.rdp-root[dir="rtl"] .rdp-weeks_before_enter {
  animation: rdp-slide_in_right var(--rdp-animation_duration) var(--rdp-animation_timing) forwards;
}
.rdp-root[dir="rtl"] .rdp-weeks_after_exit {
  animation: rdp-slide_out_left var(--rdp-animation_duration) var(--rdp-animation_timing) forwards;
}
@keyframes rdp-fade_in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@keyframes rdp-fade_out {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
.rdp-caption_after_enter {
  animation: rdp-fade_in var(--rdp-animation_duration) var(--rdp-animation_timing) forwards;
}
.rdp-caption_after_exit {
  animation: rdp-fade_out var(--rdp-animation_duration) var(--rdp-animation_timing) forwards;
}
.rdp-caption_before_enter {
  animation: rdp-fade_in var(--rdp-animation_duration) var(--rdp-animation_timing) forwards;
}
.rdp-caption_before_exit {
  animation: rdp-fade_out var(--rdp-animation_duration) var(--rdp-animation_timing) forwards;
}
.rdp-root {
  width: 100% !important;
  padding: 0 !important;
  user-select: none;
}
.rdp-nav {
  position: absolute;
  width: 100%;
  height: fit-content !important;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.rdp-caption_label {
  color: var(--color-text-100) !important;
}
.rdp-months {
  width: 100%;
  max-width: unset !important;
}
.rdp-month_caption {
  text-align: center;
  width: 100%;
  height: 36px !important;
  display: block !important;
  font-size: 14px !important;
}
.rdp-month_grid {
  width: 100%;
}
.rdp-month {
  width: 100%;
}
.rdp-button_previous {
  background-color: var(--color-overlay-light) !important;
  border-radius: 50%;
}
.rdp-button_previous:hover {
  background-color: var(--color-overlay-glass) !important;
}
.rdp-button_previous > svg {
  fill: var(--color-text-100) !important;
  width: 16px !important;
  height: 16px !important;
}
.rdp-button_next {
  background-color: var(--color-overlay-light) !important;
  border-radius: 50%;
}
.rdp-button_next:hover {
  background-color: var(--color-overlay-glass) !important;
}
.rdp-button_next > svg {
  fill: var(--color-text-100) !important;
  width: 16px !important;
  height: 16px !important;
}
.rdp-weekdays {
  display: flex;
  justify-content: space-between;
}
.rdp-weekday {
  padding: 16px 0 !important;
  font-size: 14px !important;
  font-weight: var(--font-weight-medium) !important;
  color: var(--color-text-80) !important;
}
.rdp-weeks {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.rdp-week {
  display: flex;
  justify-content: space-between;
}
.rdp-day {
  width: 24px !important;
  height: 24px !important;
}
.rdp-day_button {
  width: 24px !important;
  height: 24px !important;
  font-size: var(--text-xs) !important;
  color: var(--color-text-80) !important;
}
.rdp-day_button:disabled {
  color: var(--color-text-50) !important;
}
.rdp-day.rdp-today {
  outline: 1px solid var(--color-violet-700) !important;
  border-radius: 50% !important;
}
.rdp-day.rdp-selected {
  background: var(--seq-color-gradient-primary) !important;
  border-radius: 50% !important;
}
@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
@keyframes slideUp {
  0% {
    transform: translateY(100%);
  }
  100% {
    transform: translateY(0);
  }
}
@keyframes shimmer {
  0% {
    background-position: -200% -200%;
  }
  100% {
    background-position: 200% 200%;
  }
}
@keyframes bellRing {
  0%,
	100% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(10deg);
  }
  75% {
    transform: rotate(-10deg);
  }
}
video::-webkit-media-controls {
  display: none !important;
}
@property --tw-rotate-x {
  syntax: "*";
  inherits: false;
}
@property --tw-rotate-y {
  syntax: "*";
  inherits: false;
}
@property --tw-rotate-z {
  syntax: "*";
  inherits: false;
}
@property --tw-skew-x {
  syntax: "*";
  inherits: false;
}
@property --tw-skew-y {
  syntax: "*";
  inherits: false;
}
@property --tw-leading {
  syntax: "*";
  inherits: false;
}
@property --tw-font-weight {
  syntax: "*";
  inherits: false;
}
@property --tw-tracking {
  syntax: "*";
  inherits: false;
}
@property --tw-shadow-color {
  syntax: "*";
  inherits: false;
}
@property --tw-inset-shadow-color {
  syntax: "*";
  inherits: false;
}
@property --tw-ring-color {
  syntax: "*";
  inherits: false;
}
@property --tw-inset-ring-color {
  syntax: "*";
  inherits: false;
}
@property --tw-ring-inset {
  syntax: "*";
  inherits: false;
}
@property --tw-blur {
  syntax: "*";
  inherits: false;
}
@property --tw-brightness {
  syntax: "*";
  inherits: false;
}
@property --tw-contrast {
  syntax: "*";
  inherits: false;
}
@property --tw-grayscale {
  syntax: "*";
  inherits: false;
}
@property --tw-hue-rotate {
  syntax: "*";
  inherits: false;
}
@property --tw-invert {
  syntax: "*";
  inherits: false;
}
@property --tw-opacity {
  syntax: "*";
  inherits: false;
}
@property --tw-saturate {
  syntax: "*";
  inherits: false;
}
@property --tw-sepia {
  syntax: "*";
  inherits: false;
}
@property --tw-drop-shadow {
  syntax: "*";
  inherits: false;
}
@property --tw-drop-shadow-color {
  syntax: "*";
  inherits: false;
}
@property --tw-drop-shadow-size {
  syntax: "*";
  inherits: false;
}
@property --tw-backdrop-blur {
  syntax: "*";
  inherits: false;
}
@property --tw-backdrop-brightness {
  syntax: "*";
  inherits: false;
}
@property --tw-backdrop-contrast {
  syntax: "*";
  inherits: false;
}
@property --tw-backdrop-grayscale {
  syntax: "*";
  inherits: false;
}
@property --tw-backdrop-hue-rotate {
  syntax: "*";
  inherits: false;
}
@property --tw-backdrop-invert {
  syntax: "*";
  inherits: false;
}
@property --tw-backdrop-opacity {
  syntax: "*";
  inherits: false;
}
@property --tw-backdrop-saturate {
  syntax: "*";
  inherits: false;
}
@property --tw-backdrop-sepia {
  syntax: "*";
  inherits: false;
}
@property --tw-duration {
  syntax: "*";
  inherits: false;
}
@property --tw-ease {
  syntax: "*";
  inherits: false;
}
@property --tw-gradient-position {
  syntax: "*";
  inherits: false;
}
@property --tw-gradient-stops {
  syntax: "*";
  inherits: false;
}
@property --tw-gradient-via-stops {
  syntax: "*";
  inherits: false;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
@keyframes enter {
  from {
    opacity: var(--tw-enter-opacity,1);
    transform: translate3d(var(--tw-enter-translate-x,0),var(--tw-enter-translate-y,0),0)scale3d(var(--tw-enter-scale,1),var(--tw-enter-scale,1),var(--tw-enter-scale,1))rotate(var(--tw-enter-rotate,0));
    filter: blur(var(--tw-enter-blur,0));
  }
}
@keyframes exit {
  to {
    opacity: var(--tw-exit-opacity,1);
    transform: translate3d(var(--tw-exit-translate-x,0),var(--tw-exit-translate-y,0),0)scale3d(var(--tw-exit-scale,1),var(--tw-exit-scale,1),var(--tw-exit-scale,1))rotate(var(--tw-exit-rotate,0));
    filter: blur(var(--tw-exit-blur,0));
  }
}
@keyframes skeleton {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
@keyframes swipe-out {
  from {
    transform: translateX(var(--radix-toast-swipe-end-x));
  }
  to {
    transform: translateX(100%);
  }
}
@layer properties {
  @supports ((-webkit-hyphens: none) and (not (margin-trim: inline))) or ((-moz-orient: inline) and (not (color:rgb(from red r g b)))) {
    *, ::before, ::after, ::backdrop {
      --tw-translate-x: 0;
      --tw-translate-y: 0;
      --tw-translate-z: 0;
      --tw-rotate-x: initial;
      --tw-rotate-y: initial;
      --tw-rotate-z: initial;
      --tw-skew-x: initial;
      --tw-skew-y: initial;
      --tw-space-y-reverse: 0;
      --tw-border-style: solid;
      --tw-leading: initial;
      --tw-font-weight: initial;
      --tw-tracking: initial;
      --tw-shadow: 0 0 #0000;
      --tw-shadow-color: initial;
      --tw-shadow-alpha: 100%;
      --tw-inset-shadow: 0 0 #0000;
      --tw-inset-shadow-color: initial;
      --tw-inset-shadow-alpha: 100%;
      --tw-ring-color: initial;
      --tw-ring-shadow: 0 0 #0000;
      --tw-inset-ring-color: initial;
      --tw-inset-ring-shadow: 0 0 #0000;
      --tw-ring-inset: initial;
      --tw-ring-offset-width: 0px;
      --tw-ring-offset-color: #fff;
      --tw-ring-offset-shadow: 0 0 #0000;
      --tw-outline-style: solid;
      --tw-blur: initial;
      --tw-brightness: initial;
      --tw-contrast: initial;
      --tw-grayscale: initial;
      --tw-hue-rotate: initial;
      --tw-invert: initial;
      --tw-opacity: initial;
      --tw-saturate: initial;
      --tw-sepia: initial;
      --tw-drop-shadow: initial;
      --tw-drop-shadow-color: initial;
      --tw-drop-shadow-alpha: 100%;
      --tw-drop-shadow-size: initial;
      --tw-backdrop-blur: initial;
      --tw-backdrop-brightness: initial;
      --tw-backdrop-contrast: initial;
      --tw-backdrop-grayscale: initial;
      --tw-backdrop-hue-rotate: initial;
      --tw-backdrop-invert: initial;
      --tw-backdrop-opacity: initial;
      --tw-backdrop-saturate: initial;
      --tw-backdrop-sepia: initial;
      --tw-duration: initial;
      --tw-ease: initial;
      --tw-scale-x: 1;
      --tw-scale-y: 1;
      --tw-scale-z: 1;
      --tw-content: "";
      --tw-gradient-position: initial;
      --tw-gradient-from: #0000;
      --tw-gradient-via: #0000;
      --tw-gradient-to: #0000;
      --tw-gradient-stops: initial;
      --tw-gradient-via-stops: initial;
      --tw-gradient-from-position: 0%;
      --tw-gradient-via-position: 50%;
      --tw-gradient-to-position: 100%;
      --tw-animation-delay: 0s;
      --tw-animation-direction: normal;
      --tw-animation-duration: initial;
      --tw-animation-fill-mode: none;
      --tw-animation-iteration-count: 1;
      --tw-enter-blur: 0;
      --tw-enter-opacity: 1;
      --tw-enter-rotate: 0;
      --tw-enter-scale: 1;
      --tw-enter-translate-x: 0;
      --tw-enter-translate-y: 0;
      --tw-exit-blur: 0;
      --tw-exit-opacity: 1;
      --tw-exit-rotate: 0;
      --tw-exit-scale: 1;
      --tw-exit-translate-x: 0;
      --tw-exit-translate-y: 0;
    }
  }
}
`;
