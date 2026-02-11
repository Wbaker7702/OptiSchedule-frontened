# OptiSchedule-pro: Technical Architecture & Design

## 1. Data Integrity & Time Management
To ensure global reliability, **OptiSchedule-pro** adheres to the following data standards:
* **Universal Time Coordination (UTC):** All timestamps are stored in the database as UTC. Timezone conversion is handled exclusively at the UI layer to prevent "drifting" appointments.
* **Conflict Validation:** The system utilizes **Allen’s Interval Algebra** to detect overlaps. An overlap is flagged if: 
    `(Start_A < End_B) AND (End_A > Start_B)`
* **Soft-Invalidation:** When availability changes, conflicting appointments are not deleted. They are flagged as `INVALID` with an `audit_metadata` string explaining the specific conflict (e.g., "Conflict with Friday Lunch").

## 2. Optimization Engine (Constraint Logic)
The scheduling engine moves beyond simple "first-come, first-served" logic:
* **Weighted Scoring:** Assignments are calculated using an objective function: `Maximize Z = Σ (Weight_i * Priority_i)`. This ensures high-priority meetings and VIP attendees are prioritized.
* **Heuristic Search:** To maintain performance, the algorithm applies **Constraint Propagation**. It evaluates the most limited resources (e.g., Conference Rooms) before evaluating flexible resources (e.g., Attendee time), reducing the search space and API latency.

## 3. AI & LLM Integration
The "Pro" AI features are built for reliability and security:
* **Intent Extraction:** The LLM acts as a controller, not a database administrator. It parses natural language into structured **JSON** via Function Calling.
* **Validation Layer:** Extracted data is passed to the **Logic Layer** for mathematical validation before any database write occurs.
* **Privacy (PII Anonymization):** All sensitive user data is anonymized before being sent to external LLM providers to ensure data privacy and compliance.

## 4. Scalability & Security
* **Tenant Isolation:** Every query is scoped via `org_id` to ensure strict data separation between different companies.
* **Asynchronous Processing:** Heavy optimization tasks are offloaded to a background worker (Task Queue) to keep the user interface responsive.
* 
