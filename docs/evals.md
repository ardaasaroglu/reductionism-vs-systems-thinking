# Evals

The repository ships an eval suite for `claude plugin eval`. It checks three things: that a discount decision gets a full tradeoff card with a call, a domain, a revisit trigger and a loop with a delay; that a small copy change stays Complicated with the Reductionist leading, instead of being blocked by speculative loops; and that the skill starts when someone asks in plain words.

## Results

**Not run for v0.2.0.** The cases are written and their structure is checked by `npm test`, but the suite has not been run against a model yet, so there are no scores and no with and without delta to report. When a run is recorded, its date, Claude Code version, model, scores and delta will be added here.

## The cases

| Case | Prompt | Graders | Passes when |
|---|---|---|---|
| `discount-card` | Should a fictional budgeting app give 20% off its annual plan | `regex` for the call, the domain and "Revisit when", `llm` judge | The card shows the arithmetic and the 25% break-even, names a loop with who reacts, a delay and a signal, and makes one call with a revisit trigger |
| `button-copy-complicated` | Should a fictional task app change its pricing page button copy | `llm` judge | The domain is Complicated (or Clear), the Reductionist leads, the call is Go or Go with guardrails with an A/B test, and systems concerns become guardrails |
| `natural-request-fires` | "We're thinking about raising our marketplace commission from 10% to 12%. Is that a good idea?" | `tool_used: Skill` matching `reductionism-vs-systems-thinking:decide`, scored in both arms, and a `regex` for the call | The skill starts without being named |

All three prompts are fictional. The cases live in [`evals/`](../evals).

## Running the suite

Every run makes real model calls and is billed to your Claude account or API key. In Claude Code a case runs the main conversation plus two lens agents, so one case costs a few times a single prompt. Start with one run per case and a cost ceiling:

```bash
claude plugin eval . --runs 1 --no-publish --max-cost-usd 10
```

* By default the command also runs every case without the plugin, as a baseline, and reports the difference. Add `--ablation none` to skip the baseline runs and their cost.
* `--threshold` defaults to 1.0, so one imperfect case makes the command exit with 1.
* Results land in `evals/results/<timestamp>/`, which `.gitignore` keeps out of git.

## What the checks can and cannot tell you

* The `llm` graders are judged by a small model unless `--judge-model` says otherwise. They catch a missing call, a missing break-even or a loop with no delay. They are a weaker test of whether the call is the right one.
* The button copy case is the one to watch. A plugin that finds a scary loop in every decision is easy to build and useless in practice.
* One run per case is a smoke test, not a measurement. Model output varies between runs.
