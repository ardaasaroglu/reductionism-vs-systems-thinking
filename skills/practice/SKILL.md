---
name: practice
description: Practice product judgment on a decision case. Presents a case without the answer, takes the user's reasoning, Cynefin domain and call, grades it on Reductionism, Systems thinking and Referee with specific feedback, then shows the worked tradeoff card. Use when the user wants to practice, drill or exercise product decisions, train product judgment, or test themselves on systems thinking, reductionism or Cynefin.
argument-hint: "[case name, or your own decision]"
allowed-tools: Read Grep Glob
---

# Practice: train the two lenses and the referee

Reference files, relative to this SKILL.md (the same files are at `${CLAUDE_SKILL_DIR}/references/`):

* `references/cases/README.md`: the case index.
* `references/cases/annual-discount.md`
* `references/cases/onboarding-steps.md`
* `references/cases/referral-reward.md`
* `references/cases/support-chatbot.md`
* `references/rubric.md`: how to grade.
* `references/archetypes.md`: the eight classic archetypes, for feedback on loops.

Each case file has "The situation", then a solution marker line, then the worked tradeoff card.

## 1. Pick the case

* If the user names a case, use it.
* If the user brings their own decision, use it. There is no stored solution for it.
* Otherwise, list the four cases from the index, one line each with the decision only. Never show the domain or the leader. Let the user pick, or start with the first case not done in this conversation.

## 2. Present it without the solution

Show only "The situation" and the task line, nothing below the solution marker. Never reveal the domain, the leader, the call or any part of the card before the user answers, unless they ask for it.

Ask for, in a few lines:

* The direct effect, with a number or two and the arithmetic.
* At least one loop, with signs, and whether it is R or B.
* A Cynefin domain and who leads.
* One call: Go, Go with guardrails, Redesign, or Don't.

## 3. Grade

Use `references/rubric.md`. Score Reductionism, Systems thinking and Referee from 0 to 4 each. Quote the user's own line in each piece of feedback, say what is right or missing, and give the exact fix. Recompute the user's arithmetic and check their R or B against their signs. Do not take points off for a different number when the assumption is stated and the arithmetic checks.

## 4. Show the worked solution

Then show the worked card: everything below the solution marker. Point to the one or two places where the user's answer and the card differ most, and say which test made the referee decide as it did.

For the user's own decision, grade with the rubric, then build the worked card with the decide skill (`/reductionism-vs-systems-thinking:decide`) on the same decision.

## 5. Next

Offer the next case, or a harder variant: change one fact that would move the decision to another domain, and ask again.
