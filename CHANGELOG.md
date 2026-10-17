# Changelog

## 0.3.0 (2026-10-17)

* The eval suite now aims each case at a named failure mode: no call, loops invented for a simple change, a wrong break-even, loops labeled against their signs, lenses that do not run on their own, a mixed decision that is not split, and an emergency that gets analyzed instead of handled. Six cases, up from three.
* `scripts/check-polarity.mjs` checks every card the model writes during an eval run: each loop must close and carry the R or B label its signs give it. The worked cases go through the same check in `npm test`.
* A manual-only `evals` workflow runs the suite on GitHub with a cost ceiling.

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
