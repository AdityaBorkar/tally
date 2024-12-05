## Improvements:

### Functions:

- Absolute Error Handling
- Save Entries in Local Storage and Retrieve Back (Too many entries! We currently support only 200 entries at a time. Please split your entries into multiple files and upload them.)
- Start Work on Manthan
- Tally - SMS scrape and Smart Predictions

### UI:

Basics:

- Tooltip
- Spinner
- Textarea
- Highlight

Complex:

- useToast
- useDisclosure
- Modal, ModalOverlay, ModalContent, ModalBody, ModalHeader, ModalButton, ModalClose

### Improving Tables:

1. I know this is not the answer you were looking for, but I recommend using an IntersectionObserver instead of the virtualize library. react-virtualized is not great for dynamic/responsive sized elements. IntersectionObserver is a native browser api that can detect when an element enters the viewport, without providing it with element sizes.
2. Use different tables with different data and inputs and calculate performance
3. Use universal benchmarks and results

---

## Things to do:

2. Connect ML Model
3. Push Changes (update, un-update) to ML Model
4. Apply model changes after the row, and add LOADING INTELLIGENT RECOMMENDATIONS modal
5. Performance Metrics
6. Performance Optimization

// todo - add "Select Company"
// todo - replace tally push/pull modal with "Tally Connected" | "Tally Disconnected" | Click to refresh
// todo - on hover `mobile sync` -> show device connected and last synced

## How to use?

1. Upload Monthly Statements
2. After pushing data to tally, verify closing balance
3. "Bank OD A/c", "Bank Accounts", and "Cash-in-Hand" are classified for Contra, rest all entries are rejected.

## References:

https://stackoverflow.com/questions/48383877/tally-xml-integration-request-types-etc

-------------- BUSINESS: -----------------------

### Freemium Pricing Model:

- FREE = 1 Bank Account / month
- PAID:
  - Introductary discount [40% discount]
  - Retail = Rs. 50 /ac-mon
  - Agents = Rs. 40 /ac-mon (min. 10 acc at opening)
  - Billed start of month / quarter / year [NACH]
- Smart Pricing is 20% higher than CSV Pricing.

### Long Term:

- Make CSV and SMS pricing free for everyone to use.
- Make AA-Framework the main part of business model
