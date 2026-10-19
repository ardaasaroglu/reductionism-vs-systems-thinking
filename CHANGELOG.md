# Changelog

## 0.3.0 (2026-10-20)

* A gate before the lenses, from the first real use: a frame check tests every option against the requester's own words and never picks one that misses them; an input gate names the fact that decides the call and returns a short Get X first card when one question would find it out; the referee states how much of the call is assumed and whether it flips across the plausible range; and a lite mode runs one pass with no lens agents.
* Get X first joins Go, Go with guardrails, Redesign and Don't as a fifth call. The card template has three shapes: full, short and lite.
* Every worked case now quotes the need, names the deciding input and states its assumption share. A ninth case, a fictional partner lead, stops at the gate.
* The practice rubric grades the gate, out of 15 in total.
* The eval suite now aims each case at a named failure mode: no call, loops invented for a simple change, a wrong break-even, loops labeled against their signs, lenses that do not run on their own, a mixed decision that is not split, an emergency that gets analyzed instead of handled, an option picked that misses the stated need, a full card where one question would do, a call that hides how much of it is assumed, and a quick take that runs the full method. Ten cases, up from three.
* `scripts/check-polarity.mjs` checks every card the model writes during an eval run: each loop must close and carry the R or B label its signs give it. The worked cases go through the same check in `npm test`.
* A manual-only `evals` workflow runs the suite on GitHub with a cost ceiling.
* First eval results: a lean pass scored 0.90 with the plugin against 0.37 without it, 9 of 10 cases passing. The open case, a referral decision the referee calls Complex where the worked case says Confusion, is listed in docs/evals.md.
* The loop checker reads links written without spaces, with Unicode arrows, or as one chain, and compares node names without regard to case. The lite card has a length limit, and the call line must name the call word for word.

## 0.2.0 (2026-10-17)

* Four more practice cases: a daily push notification, a marketplace take rate, a pricing page button, and matching a rival's feature list. The eight cases now cover all four calls: Go, Go with guardrails, Redesign and Don't.
* A hero image of a tradeoff card at the top of the README.
* Three eval cases for `claude plugin eval`, explained in [docs/evals.md](docs/evals.md). Not run yet, so no scores.

## 0.1.0 (2026-10-17)

* First release.
* The `decide` skill: a Reductionist and a Systems thinker analyze a product decision independently, argue once, and a Cynefin referee makes one call on a tradeoff card.
* Two lens agents with read-only tools, run in parallel in Claude Code and Cowork, and one after another in claude.ai chat.
* The `practice` skill: four fictional cases, a grading rubric for Reductionism, Systems thinking and Referee, and worked cards.
* A roadmap of 24 opposing approach pairs, and a form to propose more.
