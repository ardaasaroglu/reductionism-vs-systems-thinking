# Contributing

## Run the checks

* `npm test` runs the structural tests with Node 22 or later. There is nothing to install.
* `npx -y @anthropic-ai/claude-code@2.1.295 plugin validate . --strict` validates the plugin and marketplace manifests. It needs no login and no API key.
* To try a change, start Claude Code with `claude --plugin-dir .` and run `/reductionism-vs-systems-thinking:decide` on a fictional decision.

## Rules for changes

* The lens cards live in `skills/decide/references/lenses.md` and are copied word for word into `agents/`. Change both or neither. The tests compare them.
* `archetypes.md` exists in both skills. Keep the two copies identical.
* Cases use fictional companies. Recompute every number, and check each loop's R or B against its count of - links.
* Plain English. No em or en dashes.

## Propose an approach pair

Read the criteria in [ROADMAP.md](ROADMAP.md), then use the [approach proposal form](https://github.com/ardaasaroglu/reductionism-vs-systems-thinking/issues/new?template=approach-proposal.yml).
