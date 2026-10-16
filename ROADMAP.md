# Roadmap

This plugin starts with one pair, Reductionism vs Systems thinking, judged by a Cynefin referee. More fundamental product approaches follow as opposing pairs that the same referee judges: each side leads in the domain where it is strong, and the other side becomes guardrails.

The list is ranked for the AI era by how often product people face the decision and how much a wrong call costs. Status is one of Shipped, In progress, Planned or Candidate. Votes move candidates up.

| # | Pair | The question it settles | Sources | Status |
|---|---|---|---|---|
| 0 | Reductionism vs Systems thinking (referee: Cynefin) | What happens if we make this change, now and later | Meadows, Thinking in Systems; Senge, The Fifth Discipline; Minto, The Pyramid Principle; Fermi estimation; Snowden and Boone, "A Leader's Framework for Decision Making" (2007) | Shipped 0.1.0 |
| 1 | Autonomy vs Oversight | Should the AI act alone or ask first | Parasuraman, Sheridan and Wickens, "A Model for Types and Levels of Human Interaction with Automation" (2000); Bainbridge, "Ironies of Automation" (1983) | Planned |
| 2 | Deterministic vs Probabilistic | Rules and code, or a model, for this step | Karpathy, "Software 2.0" (2017); Sculley et al., "Hidden Technical Debt in Machine Learning Systems" (2015) | Planned |
| 3 | Unit economics vs Growth | Every AI answer costs money: does growth make or lose money at scale | Skok, "SaaS Metrics 2.0"; Hoffman and Yeh, Blitzscaling (2018) | Planned |
| 4 | Scaffolding vs the Bitter Lesson | Build workarounds for today's model, or wait for the next one | Sutton, "The Bitter Lesson" (2019) | Planned |
| 5 | Centaur vs Cyborg | Split work between people and AI, or blend AI into every step | Dell'Acqua et al., "Navigating the Jagged Technological Frontier" (2023) | Planned |
| 6 | Inside view vs Outside view | Will it hit the target, and when | Kahneman and Lovallo, "Timid Choices and Bold Forecasts" (1993); Flyvbjerg, reference class forecasting | Planned |
| 7 | First principles vs Analogy | Reason from fundamentals, or copy what worked elsewhere | Gavetti and Rivkin, "How Strategists Really Think: Tapping the Power of Analogy" (2005) | Planned |
| 8 | Working backwards vs Capability forward | Start from the customer, or from what the model can do | Bryar and Carr, Working Backwards (2021) | Candidate |
| 9 | Experiment vs Conviction | Test it, or decide on judgment | Kohavi, Tang and Xu, Trustworthy Online Controlled Experiments (2020); Norman and Verganti, "Incremental and Radical Innovation" (2014) | Candidate |
| 10 | Throughput vs Local efficiency | AI made building fast: where is the bottleneck now | Goldratt, The Goal (1984) | Candidate |
| 11 | Closed loop vs Open loop | What feedback and control (evals, monitoring, kill switch) must exist before launch | Wiener, Cybernetics (1948); Ashby, An Introduction to Cybernetics (1956) | Candidate |
| 12 | Attention vs Engagement | Should this feature spend the user's attention | Simon, "Designing Organizations for an Information-Rich World" (1971) | Candidate |
| 13 | Personalization vs Privacy | How much should the product remember about the user | Cavoukian, "Privacy by Design: The 7 Foundational Principles" (2009) | Candidate |
| 14 | Explore vs Exploit | Improve the core, or bet on the new | March, "Exploration and Exploitation in Organizational Learning" (1991) | Candidate |
| 15 | Jobs to be Done vs Stated requests | Build what they ask for, or the job behind it | Christensen et al., Competing Against Luck (2016) | Candidate |
| 16 | False positives vs False negatives | Which mistake costs more here | Provost and Fawcett, Data Science for Business (2013) | Candidate |
| 17 | Adding vs Subtracting | Add a feature, or remove something | Adams et al., "People systematically overlook subtractive changes", Nature (2021) | Candidate |
| 18 | Proxy vs Goal | Is the metric still measuring the goal once it is a target | Goodhart's law (Goodhart, 1975) | Candidate |
| 19 | Deliberate vs Emergent strategy | Follow the plan, or the patterns that emerge | Mintzberg and Waters, "Of Strategies, Deliberate and Emergent" (1985) | Candidate |
| 20 | Optionality vs Commitment | Stay model-agnostic, or go deep on one provider | Taleb, Antifragile (2012); Myers, real options (1977) | Candidate |
| 21 | Cognitive load vs Capability | Simple or powerful | Sweller, cognitive load theory (1988) | Candidate |
| 22 | Expected value vs Regret minimization | Should we take this one-way bet | Loomes and Sugden, "Regret Theory" (1982) | Candidate |
| 23 | Pre-mortem vs Pre-parade | Are we ready to launch | Klein, "Performing a Project Premortem" (2007); Heath and Heath, Decisive (2013) | Candidate |
| 24 | Build vs Buy by evolution stage | Is this layer turning into a commodity | Wardley, Wardley Maps | Candidate |

## How to vote

Pairs are tracked as issues labeled roadmap. Add a thumbs-up to the pair's issue, or comment with a product decision where the pair would have helped you. All roadmap issues: https://github.com/ardaasaroglu/reductionism-vs-systems-thinking/issues?q=label%3Aroadmap

## Propose an approach

Use the approach proposal form: https://github.com/ardaasaroglu/reductionism-vs-systems-thinking/issues/new?template=approach-proposal.yml

A pair gets on the list when it has:

* A fundamental practice with a named source, not a branded tool.
* A real opposing approach that would decide differently on the same decision.
* A who-leads-when rule in plain tests that a referee can apply.
* One worked decision whose numbers check.
* An end in a call: Go, Go with guardrails, Redesign, or Don't.
