# Case: a partner asks for two-way text reminders

## The situation

Tidewell is a fictional appointment scheduling app for small clinics. Brightfern Clinics, a fictional regional chain, wants to become a partner. Its operations lead writes: "Patients should confirm or cancel by text, and the schedule should update itself. We want this live before spring."

* Tidewell sends email reminders today. It has no text messaging.
* Four options are on the table:
  1. Build two-way texting in-house: about $60,000 of engineering, then about $0.01 per message.
  2. White-label a messaging vendor: about $8,000 to integrate, then $0.04 per message.
  3. Offer the existing email reminders now, with a reply-to-cancel link.
  4. Refer the chain to a texting partner for a one-time $500 referral fee.
* Each appointment needs 2 messages: the reminder and the patient's reply. Tidewell would charge $0.15 per appointment.
* Nobody has asked the chain how many appointments it books a month.

**Your task:** name the need and the input that decides the call, place the decision in a Cynefin domain if you get that far, say who leads, and make one call: Go, Go with guardrails, Redesign, Don't, or Get X first. Show your reasoning: a number or two for each option you keep.

<!-- solution: do not show before the user answers -->

# Tradeoff card: a partner asks for two-way text reminders

* **The call:** Get the chain's appointments per month first.
* **The need:** "Patients should confirm or cancel by text, and the schedule should update itself."
* **Why it decides:** each on-need option wins at a different volume, and the volume is one email away.
* **What to ask:** "How many appointments do your clinics book in a typical month, across all locations?", to the chain's operations lead.
* **Thresholds:** refer them below about 9,500 appointments a month; white-label from 9,500 to 72,000; build above 72,000.
* **Off-need:** email reminders with a reply-to-cancel link miss "by text" and "confirm".
* **Revisit when:** the chain answers. Then run the full card on the option the volume points to.

## How the thresholds were set

* **Margin per appointment:** white-label $0.15 - 2 x $0.04 = $0.07; build $0.15 - 2 x $0.01 = $0.13.
* **White-label:** pays back its $8,000 within a year above $8,000 / $0.07 / 12 = 9,524 appointments a month.
* **Build:** beats white-label within a year when its extra $0.13 - $0.07 = $0.06 per appointment covers the extra $60,000 - $8,000 = $52,000: $52,000 / $0.06 / 12 = 72,222 appointments a month.
* **Refer:** below about 9,500 a month, neither paid option earns back its cost within a year, and the $500 fee comes with no build and no support load.

## Why the lenses did not run

* The deciding input is unknown, and finding it out costs one email. A full card before that answer would rest on an assumed volume, so every number in it would look more precise than it is.
* Email reminders are the cheapest option and the fastest to offer, which is exactly why the frame check matters: they do not answer the need in the chain's own words, so the referee may never pick them.
* Once the volume is known, the full card runs on the option it points to. Above 72,000 a month, the Systems thinker would look at what building commits the team to: carrier rules, support for failed texts, and a vendor that could sell to the chain directly.
