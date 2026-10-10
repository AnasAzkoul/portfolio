# Issue tracker: Linear

Issues and specs for this repo live in Linear. Use the Linear MCP tools (`list_issues`, `get_issue`, `save_issue`, `save_comment`, `list_comments`, `create_issue_label`) for all operations. Never shell out to `gh`.

- **Team**: `ANA` (Anas Azkoul)
- **Project**: `Portfolio Website`
- **Issue IDs**: `ANA-<n>`

## Conventions

- **Create an issue**: `save_issue` with `team: "ANA"`, `project: "Portfolio Website"`, `title`, and a markdown `description` (real newlines, no `\n` escapes). New issues start in `Backlog`.
- **Read an issue**: `get_issue` for body, labels, status; `list_comments` for the thread.
- **List issues**: `list_issues` filtered by `project: "Portfolio Website"` plus `label` / `state` as needed.
- **Comment**: `save_comment` with the issue ID.
- **Apply / remove labels**: `save_issue` with the full updated `labels` list. If a triage label doesn't exist yet, create it with `create_issue_label` (team `ANA`) first.
- **Close**: comment with the reason, then set status `Done` (completed) or `Canceled` (won't do). Use `Duplicate` for duplicates.

Statuses: `Backlog` → `Todo` → `In Progress` → `In Review` → `Done` / `Canceled` / `Duplicate`.

## When a skill says "publish to the issue tracker"

Create a Linear issue in team `ANA`, project `Portfolio Website`.

## When a skill says "fetch the relevant ticket"

`get_issue ANA-<n>` plus `list_comments`.

## Wayfinding operations

Used by `/wayfinder`. The **map** is a single parent issue with **child** issues as tickets.

- **Map**: an issue labelled `wayfinder:map`, holding the Notes / Decisions-so-far / Fog body.
- **Child ticket**: a Linear sub-issue of the map (`save_issue` with `parentId` = map). Labels: `wayfinder:<type>` (`research`/`prototype`/`grilling`/`task`). Once claimed, assigned to the driving dev.
- **Blocking**: Linear's native "blocked by" issue relations. If unavailable, fall back to a `Blocked by: ANA-<n>, ANA-<n>` line at the top of the child body. Unblocked when every blocker is `Done`/`Canceled`.
- **Frontier query**: the map's open sub-issues, minus any with an open blocker or an assignee; first in map order wins.
- **Claim**: `save_issue` with `assignee: "me"` and status `In Progress`, the session's first write.
- **Resolve**: `save_comment` with the answer, set status `Done`, then append a context pointer (gist + link) to the map's Decisions-so-far.
