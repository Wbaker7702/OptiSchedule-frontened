---
name: optischedule-security
description: Security hardening and dependency scanning
on:
  workflow_dispatch:
  push:
    branches: [ main ]

permissions:
  contents: read
  security-events: read
  pull-requests: read
  issues: read
---

# 🔐 OptiSchedule Pro Security Hardening

## Scope
- Dependency audit
- Secret scanning
- SBOM generation

## Output
- Security report
- Risk classification summary
