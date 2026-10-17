---
max_turns: 30
timeout_seconds: 1200
allowed_tools: [Read, Glob, Grep, Skill, Agent]
tags: [quality, referee]
---

Our main payment provider has failed 40% of checkouts for the last 50 minutes. Normally it fails under 1%. Should we switch everything to our backup provider now, or investigate first?

Fictional product: Ticketbloom, an event ticketing app. The backup provider is integrated and tested every month. Switching all traffic is one config change and can be undone in 10 minutes. A large concert goes on sale in 2 hours.
