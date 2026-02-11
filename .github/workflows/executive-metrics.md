---
name: optischedule-executive-metrics
description: Weekly executive repository intelligence
on:
  workflow_dispatch:
  schedule:
    - cron: "17 10 * * 1"

permissions:
  contents: read
  issues: read
  pull-requests: read
---

# 📊 Executive Governance Report

## Metrics
- Commit velocity
- PR delta
- Open issue trend
- Security signals

## Output
Board-ready executive summary.

