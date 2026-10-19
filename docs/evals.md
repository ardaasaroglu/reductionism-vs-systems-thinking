# Evals

The plugin's output is a judgment call, the hardest kind of output to test. Four of the cases come from the first real use, which showed the method answering the wrong frame, building a full card on guesses, and costing more than one qualifying question. So every case aims at one named way a tradeoff card can go wrong, every case also runs without the plugin as a baseline, code checks the structure, and a judge model checks the judgment.

## Results

**Not run yet (v0.3.0).** The cases are written and their structure is checked by `npm test`. The first run will be published here with its date, Claude Code version, model, cost, pass rate per case, and the difference with and without the plugin.

## Failure modes and the cases that test them

| Failure mode | Case | Graders | Scored |
|---|---|---|---|
| No call, only "it depends" | `discount-card`, `natural-request-fires`, `lenses-independent` | `regex`: "The call:" followed by Go, Redesign, Don't or Get | Both arms |
| Wrong break-even | `discount-card` | `regex` for 25%, `llm` judge | Both arms |
| No loop with a delay | `discount-card` | `llm` judge | Both arms |
| Loops invented for a simple change | `button-copy-complicated` | `llm` judge: Complicated, the Reductionist leads, loop concerns become guardrails | Both arms |
| A loop labeled against its signs | Every card | `scripts/check-polarity.mjs` over the run results | By code, after the run |
| The lenses do not run on their own | `lenses-independent` | `tool_used`: each lens agent launched; `llm` judge: numbers and a loop | Agents: indicator. Judge: both arms |
| A mixed decision is not split | `confusion-split` | `regex` for the Confusion domain; `llm` judge: each part gets its own leader | Both arms |
| An emergency gets analyzed instead of handled | `chaotic-act-first` | `regex` for the Chaotic domain; `llm` judge: act now, revisit when stable | Both arms |
| An option picked that misses the stated need | `off-need-option` | `regex` for the need line; `llm` judge: the call never picks an option that misses the requester's words | Both arms |
| A full card where one question would do | `get-x-first` | `regex` for a Get X first call; `llm` judge: a question ready to send and a threshold per option | Both arms |
| A confident call that hides its assumptions | `assumption-flip` | `regex` for the assumption share; `llm` judge: names the cancellation share where the call flips | Both arms |
| A quick take that runs the full method | `lite-mode` | `tool_used`: no Agent call at all; `llm` judge: a short card | Both arms |
| The skill does not start on a plain question | `natural-request-fires` | `tool_used: Skill` | Indicator |

All prompts are fictional. The cases live in [`evals/`](../evals).

## How the scores work

* **Baseline.** By default every case runs twice, with the plugin and without it. The headline number is the difference.
* **Indicators.** A check that only makes sense with the plugin loaded, such as the skill firing or the lens agents launching, is an indicator: it shows in the with arm and is never scored, so it cannot inflate the difference. `tool_used: Skill` checks are indicators by default, and the agent checks are marked `arm: with-only`.
* **Code grades structure, a judge grades judgment.** `claude plugin eval` has no custom-code graders, so `scripts/check-polarity.mjs` runs after the suite. It reads the run results and checks every loops table: each loop must close, and its R or B label must match its count of negative links. The worked cases in this repository pass the same check in `npm test`.
* **Three runs per case** by default. Model output varies, so the pass rate counts, not one run.
* **Checking the judge.** The `llm` graders are judged by a small model. After a run, a sample of its verdicts is graded by hand, and the agreement rate is published with the results.
* **Grader hygiene.** `npm test` rejects any prompt or grader key that the eval docs do not list, because a mistyped grader key would fail quietly.

## Running the suite

Every run makes real model calls under your own Claude login or API key. A case runs the skill with two lens agents, so it costs a few times a single prompt. Start lean:

```bash
claude plugin eval . --runs 1 --no-publish --max-cost-usd 10
node scripts/check-polarity.mjs evals/results/
```

* Drop `--runs 1` for the default of three runs per case.
* `--ablation none` skips the baseline runs and halves the cost. In the baseline arm, "Agent type ... not found" for the lens agents is expected.
* `--threshold` defaults to 1.0, so one imperfect case makes the command exit with 1.
* Results land in `evals/results/`, which `.gitignore` keeps out of git.
* The `evals` workflow in `.github/workflows/evals.yml` runs the same suite on GitHub when started by hand. It needs an `ANTHROPIC_API_KEY` repository secret, asks for a cost ceiling, never runs on push or pull request, and uploads the results.

## Known limits

* The documented result format does not name the field that holds Claude's final reply. The polarity checker scans every string in the result files for a loops table, so it does not depend on that name. So far it has been tested on a made-up result only; the first real run will confirm it finds the cards.
* `tool_used` counts tool calls. It shows that both lens agents ran, not that they were launched in the same message.
* A judge model is better at checking that a call is there than that it is right. The hand-graded sample is the check on that.
