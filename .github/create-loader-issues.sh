#!/usr/bin/env bash
# Creates GitHub issues for the loader cleanup plan.
# Requires: gh auth login (run once before using this script)
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ISSUES_DIR="$REPO_ROOT/.github/issues"

create_issue() {
  local file="$1"
  local title
  title="$(head -n 1 "$file" | sed 's/^# Issue [0-9]*: //')"
  echo "Creating: $title"
  gh issue create --title "$title" --body-file "$file" --label "loader"
}

create_issue "$ISSUES_DIR/001-loader-animationend-early-dismiss.md"
create_issue "$ISSUES_DIR/002-loader-missing-brand-text.md"
create_issue "$ISSUES_DIR/003-remove-media-ready-debug-logging.md"
create_issue "$ISSUES_DIR/004-consolidate-video-ready-logic.md"
create_issue "$ISSUES_DIR/005-deduplicate-media-ready-css.md"

echo "Done. View issues: gh issue list --label loader"
