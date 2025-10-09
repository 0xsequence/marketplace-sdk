---
"@0xsequence/marketplace-sdk": patch
---

fix(calendar): set selected date to end of day for ‘Today’ selection

Selecting ‘Today’ previously set the time to 00:00, which could correspond to a past time and cause order errors. 
Added `setToEndOfDay` utility and updated `setSelectedDate` to ensure the selected date is set to 23:59:59.999.