# TaskFlow Task Manager — Test Report

| | |
|---|---|
| **Verdict** | **PASS** |
| Run date | 10/21/2026, 9:35:55 PM |
| Browser | Chromium (Desktop Chrome, 1280x800; mobile 390x844 for 1 test) |
| Tests | 48 total, 48 passed, 0 failed |
| Pass rate | 100.0% |
| Duration | 130.1s |
| App under test | `Task-Manager-for-tasks` at http://localhost:5173 |

## Results by suite

### 01-dashboard.spec.ts

| # | Test | Result | Time |
|---|---|---|---|
| 1 | renders zero-state cleanly when no tasks exist | PASS | 9.8s |
| 2 | calculates totals, status counts, overdue, and completion % accurately | PASS | 10.6s |
| 3 | navigates from upcoming task to its details page | PASS | 8.8s |

### 02-task-crud.spec.ts

| # | Test | Result | Time |
|---|---|---|---|
| 1 | creates a new task and it appears in the list + localStorage | PASS | 11.8s |
| 2 | cancelling the new task form does not create a task | PASS | 3.6s |
| 3 | edits a task from the details page and persists changes | PASS | 6.0s |
| 4 | editing allows a past due date (requireFutureDate is off on edit) | PASS | 4.8s |
| 5 | deletes a task from the list after confirming the dialog | PASS | 3.9s |
| 6 | dismissing the delete dialog keeps the task | PASS | 3.9s |
| 7 | deletes a task from the details page and redirects to the list | PASS | 5.2s |

### 03-form-validation.spec.ts

| # | Test | Result | Time |
|---|---|---|---|
| 1 | blocks submit and shows all errors when form is empty | PASS | 5.3s |
| 2 | enforces minimum title length of 3 characters | PASS | 4.7s |
| 3 | accepts a title of exactly 3 characters | PASS | 6.1s |
| 4 | enforces maximum title length of 80 characters | PASS | 6.1s |
| 5 | enforces minimum description length of 10 characters | PASS | 6.0s |
| 6 | enforces maximum description length of 500 characters | PASS | 5.1s |
| 7 | requires an explicit priority selection | PASS | 4.1s |
| 8 | rejects a past due date when creating a task | PASS | 13.8s |
| 9 | accepts today as a due date when creating | PASS | 10.4s |
| 10 | clears a field error as soon as the field becomes valid | PASS | 9.3s |

### 04-filtering-and-search.spec.ts

| # | Test | Result | Time |
|---|---|---|---|
| 1 | searches by title, case-insensitively | PASS | 9.3s |
| 2 | searches by description text | PASS | 7.0s |
| 3 | shows empty state when the search matches nothing | PASS | 7.5s |
| 4 | filters by each status tab | PASS | 9.9s |
| 5 | combines search and status filter | PASS | 8.1s |
| 6 | clearing the search restores the full filtered list | PASS | 8.4s |
| 7 | changes a task status from the list inline dropdown | PASS | 7.1s |
| 8 | changes a task status from the details page dropdown | PASS | 6.4s |

### 05-persistence-and-routing.spec.ts

| # | Test | Result | Time |
|---|---|---|---|
| 1 | tasks survive a full page reload | PASS | 7.4s |
| 2 | a task created in the UI is still present after navigating away and back | PASS | 11.3s |
| 3 | corrupt localStorage falls back to an empty task list instead of crashing | PASS | 7.3s |
| 4 | a non-array value in localStorage is ignored safely | PASS | 7.4s |
| 5 | navigates between Dashboard and Tasks via the header | PASS | 10.6s |
| 6 | marks the active nav link | PASS | 7.9s |
| 7 | redirects an unknown route back to the dashboard | PASS | 6.1s |
| 8 | shows "Task not found" for a missing task id | PASS | 6.2s |
| 9 | deep links directly to a task details page | PASS | 7.2s |

### 06-screenshot-gallery.spec.ts

| # | Test | Result | Time |
|---|---|---|---|
| 1 | dashboard — populated, with stats and overdue work | PASS | 7.3s |
| 2 | dashboard — empty state | PASS | 6.4s |
| 3 | tasks list — all cards with badges | PASS | 8.6s |
| 4 | new task form — blank | PASS | 6.8s |
| 5 | new task form — validation errors shown | PASS | 6.7s |
| 6 | task details — populated | PASS | 6.2s |
| 7 | task details — edit mode | PASS | 6.6s |
| 8 | tasks list — filtered to In Progress | PASS | 5.7s |
| 9 | tasks list — search with no results | PASS | 6.0s |
| 10 | task not found state | PASS | 6.0s |
| 11 | mobile viewport — dashboard and tasks | PASS | 11.0s |

## Failures

None.

## Screenshots

### 01-dashboard-empty

![01-dashboard-empty.png](screenshots/01-dashboard-empty.png)

### 02-dashboard-populated

![02-dashboard-populated.png](screenshots/02-dashboard-populated.png)

### 03-new-task-form-filled

![03-new-task-form-filled.png](screenshots/03-new-task-form-filled.png)

### 04-task-created-list

![04-task-created-list.png](screenshots/04-task-created-list.png)

### 05-task-after-delete

![05-task-after-delete.png](screenshots/05-task-after-delete.png)

### 06-validation-all-errors

![06-validation-all-errors.png](screenshots/06-validation-all-errors.png)

### 07-validation-past-due-date

![07-validation-past-due-date.png](screenshots/07-validation-past-due-date.png)

### 08-search-no-results

![08-search-no-results.png](screenshots/08-search-no-results.png)

### 09-search-with-filter

![09-search-with-filter.png](screenshots/09-search-with-filter.png)

### 10-status-changed-dashboard

![10-status-changed-dashboard.png](screenshots/10-status-changed-dashboard.png)

### 11-task-not-found

![11-task-not-found.png](screenshots/11-task-not-found.png)

### 12-task-details

![12-task-details.png](screenshots/12-task-details.png)

### gallery-01-dashboard

![gallery-01-dashboard.png](screenshots/gallery-01-dashboard.png)

### gallery-02-dashboard-empty

![gallery-02-dashboard-empty.png](screenshots/gallery-02-dashboard-empty.png)

### gallery-03-tasks-list

![gallery-03-tasks-list.png](screenshots/gallery-03-tasks-list.png)

### gallery-04-new-task-form

![gallery-04-new-task-form.png](screenshots/gallery-04-new-task-form.png)

### gallery-05-validation-errors

![gallery-05-validation-errors.png](screenshots/gallery-05-validation-errors.png)

### gallery-06-task-details

![gallery-06-task-details.png](screenshots/gallery-06-task-details.png)

### gallery-07-task-edit

![gallery-07-task-edit.png](screenshots/gallery-07-task-edit.png)

### gallery-08-filter-in-progress

![gallery-08-filter-in-progress.png](screenshots/gallery-08-filter-in-progress.png)

### gallery-09-search-no-results

![gallery-09-search-no-results.png](screenshots/gallery-09-search-no-results.png)

### gallery-10-task-not-found

![gallery-10-task-not-found.png](screenshots/gallery-10-task-not-found.png)

### gallery-11-mobile-dashboard

![gallery-11-mobile-dashboard.png](screenshots/gallery-11-mobile-dashboard.png)

### gallery-12-mobile-tasks

![gallery-12-mobile-tasks.png](screenshots/gallery-12-mobile-tasks.png)
