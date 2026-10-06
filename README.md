# SQL Analyst Field Guide

An interlinked SQL, MySQL, and DBMS interview handbook for Data Analyst and Business Analyst preparation.

**Live guide:** https://sql-analyst-field-guide.divyansh-kumar70.chatgpt.site

## Coverage

- SQL fundamentals, querying, joins, aggregation, CTEs, and window functions
- Analytical patterns including funnels, cohorts, retention, growth, and data quality
- DBMS concepts: normalization, ACID, isolation, indexing, OLTP, and OLAP
- MySQL 8 syntax, execution plans, transactions, and dialect-specific behavior
- Interview question bank and structured SQL 50 practice plan
- Data Analyst and Business Analyst portfolio project specifications

## Run locally

The deployable static files are in `dist/` in the local source workspace. To preview them:

```bash
cd dist
python3 -m http.server 8765 --bind 127.0.0.1
```

Then open `http://127.0.0.1:8765/`.

## Repository layout

The GitHub repository keeps the deployable HTML, CSS, and JavaScript at its root so it can be served by any static host without a build step.
