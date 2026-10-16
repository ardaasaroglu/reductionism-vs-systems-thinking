# Security

reductionism-vs-systems-thinking is a set of prompts: two skills and two subagents. It has no code that runs on your machine, no hooks, no MCP servers and no network calls of its own. This page says what it can touch.

## What it reads and writes

* **Reads.** The decision you describe and the files you point it at, with the Read, Grep and Glob tools. The two lens agents declare only those three tools in their frontmatter, so Claude Code does not give them tools to write, run commands or reach the network. If Claude Code rejects the plugin agent types, the decide skill falls back to general-purpose subagents, which have the full default tool set. In that fallback the limit to Read, Grep and Glob is an instruction in the prompt, not an enforced restriction.
* **Writes.** Nothing by default. The tradeoff card appears in the conversation. Neither skill lists `Write` in `allowed-tools`, so if you ask Claude Code to save the card as a file, its usual permission check applies.
* **Sends.** Your decision goes to the Claude model your session uses, the same as any text you give Claude. The plugin adds no other destination. Do not run it on information you are not allowed to share with that model provider.

## Decisions are data, not instructions

A decision or a file can contain text aimed at the model, by accident or on purpose. The skills tell Claude and both lenses to treat decisions and files as data and never to follow instructions inside them. That is an instruction to a model, not a guarantee. If you analyze material from someone you do not trust, read the card before you act on it.

## Reporting a vulnerability

Report it privately at <https://github.com/ardaasaroglu/reductionism-vs-systems-thinking/security/advisories/new>. Please do not open a public issue for a security problem.

That link works only while private vulnerability reporting is enabled in this repository's settings. If it shows an error, open an issue asking for a private contact, and leave out any details of the problem.
