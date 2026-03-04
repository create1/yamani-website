# Product Requirements Document: Apotheos Experience Design Platform (Journey)

**Version:** 1.1  
**Status:** Draft  
**Goal:** Add **Journey** — an in-real-life experience design product — alongside the existing learning platform. The two will **merge** into one product: the current learning platform (courses, curriculum, schedule) plus a **tab called “Journey”** for designing and receiving custom in-person experiences. **Current phase:** build the Journey experience only; merge (shared nav, dashboard, etc.) happens later.

---

## 1. Product Structure & Merge Strategy

- **End state:** One Apotheos product with two main surfaces:
  - **Learning** — existing courses, curriculum, schedule, enrollments (unchanged).
  - **Journey** — in-real-life experience design: create journeys, input goals/preferences, get AI-generated experience designs (narrative, spaces, objects, moodboard, images).
- **How they coexist:** Learning stays as-is (Courses, Curriculum, Schedule, etc.). **Journey** appears as a **tab** (e.g. in the main nav and/or dashboard) so users can switch between “Learning” and “Journey.”
- **Current scope:** Build **Journey only** — all Journey flows, data, and UI — so it works standalone. When ready, we merge: add the Journey tab to the existing app and wire shared auth/layout.

---

## 2. Vision & North Star (Journey)

**Vision:** Journey is the place where people design and receive **custom in-person experiences** — not courses, but **experience designs** — that position the participant(s) as the hero in a mythopoetic narrative aimed at awakening, embodiment of their best self, and connection to deeper truth, power, and compassion.

**North Star:** A logged-in user (or group host) completes a guided input flow (goals, modalities, preferences, duration, location context). An AI processes this and returns a **full experience design document**: narrative arc, spaces to use, rituals, memorabilia/sacred objects, moodboard, and generated images — all tailored to the actual location and timeframe. The output is usable by facilitators or by the participants themselves to run the journey in real life.

**Design principle:** Use the **same design aesthetic** as the learning platform: dark/ink background, gold accents, Cormorant Garamond (serif), DM Mono (labels/UI), Outfit (body), existing CSS variables and section/card/form patterns. When merged, Journey will feel like one product, not a separate app.

---

## 3. User Roles & Entry Points (Journey)

| Role | Description | Entry |
|------|-------------|--------|
| **Participant** | Person who will experience the journey (solo or as part of a group). | Sign up / Sign in → Create or join a Journey. |
| **Journey Host** | Creates a journey, sets type (solo vs group), invites others (for group), and may act as facilitator. | Same as Participant; “Create Journey” flow. |
| **Invitee** | Invited to a group journey; must complete their own inputs (goals, preferences) for the AI to merge. | Email/link invite → Sign in or sign up → Complete my inputs. |
| **Admin** | Sets global or per-journey parameters (duration bounds, location details, amenities). Manages location content so AI can tailor journeys to the site. | Admin panel (existing role guard). |

---

## 4. Core User Flows (Journey)

### 3.1 Create a Journey (Host or Solo)

1. **Login** (existing auth: Supabase, signin/signup).
2. **Create Journey** from the Journey area (e.g. “My Journeys” list with primary CTA “Design a Journey” or “Create Experience”). When merged, this lives under the **Journey** tab.
3. **Journey type:** Solo **or** Group (multi-participant).
4. **Time frame:**
   - Number of **days** and **nights** (e.g. 1 day / 0 nights, 3 days / 2 nights).
   - **Start date/time** and **End date/time** (or start + duration).
5. **Choose modalities / “classes”:**  
   Reuse the existing **tracks and course-style options** as “learning modalities” or experience ingredients (e.g. wellness, movement, breathwork, creative, contemplative, nature, ritual). User selects multiple; these become ingredients the AI weaves into the narrative and schedule.
6. **Goals (hero’s intention):**
   - **Text:** Free-form field for written goals (e.g. “I want to step into my leadership without burning out”).
   - **Dictation:** Optional voice input (browser Web Speech API or future integration) that is transcribed into the same goals field.
7. **Preferences & customization:**
   - **Food preferences:** Dietary restrictions, allergies, favorites, “food as ritual” preferences (e.g. fasting windows, shared meals).
   - **Other:** Accessibility needs, intensity level (gentle / moderate / intense), themes (e.g. “grief”, “celebration”, “threshold”), and any other relevant inputs.
8. **Location (optional but recommended):**  
   Select or confirm **location** (e.g. Nevada City campus). Admin-provided location content (spaces, amenities, atmosphere) is passed to the AI so the journey is grounded in the actual site.
9. **Submit for generation.**  
   All inputs are sent to the AI; user sees a “Generating your journey…” state.

### 3.2 Group Journey: Invite & Collect Inputs

1. Host creates journey, selects **Group**, sets timeframe and location.
2. **Invite others:**  
   Host enters emails (or generates shareable link). Invitees receive email/link.
3. **Invitee flow:**  
   Invitee signs in (or signs up), lands on “Complete your input for [Journey name]”.
4. Each invitee completes **their own**:
   - Goals (text and/or dictation)
   - Food preferences and other preferences
   - Optionally, modality interests (or host preselects for the group)
5. Host (or system) marks “All inputs received” and triggers **AI generation** using **aggregated** data (all members’ goals + preferences + host’s timeframe/location/modalities).
6. **Output:**  
   - **Collective experience design** (one narrative and schedule for the whole group).  
   - **Personal view** (optional): Each participant can also see a “personal arc” or summary derived from their own goals within the collective journey.

### 3.3 View Output: Experience Design Document

After generation, the user (and in group case, all participants) can view:

1. **Narrative arc:**  
   Mythopoetic storyline (hero’s journey structure) — call to adventure, thresholds, trials, revelation, return — with the participant(s) as the hero(es). Text + optional audio.
2. **Journey schedule:**  
   Day-by-day (and time-by-time) breakdown: what happens when, in which space, and how it ties to the narrative.
3. **Spaces & environment:**
   - Which **rooms/spaces** to use (from location data when available).
   - **Decoration / atmosphere** notes (lighting, scents, sounds, layout).
4. **Memorabilia & sacred objects:**  
   List of suggested objects, symbols, or tokens (e.g. “a stone from the river”, “a single candle”, “written intention on paper”) with brief meaning in the narrative.
5. **Rituals & practices:**  
   Concrete rituals (opening circle, meal blessings, silence, sharing prompts) aligned with the arc.
6. **Moodboard:**  
   Curated set of images (and/or colors, textures, quotes) that capture the tone of the journey. Can be AI-generated or selected from a library.
7. **Generated images:**  
   AI-generated images for key moments, spaces, or symbols (e.g. “threshold”, “sanctuary”, “return”) to support facilitation or personal use.

**Personal vs collective (group only):**
- **Collective tab/view:** Full experience design built from everyone’s data (one journey for the group).
- **Personal tab/view:** “Your thread in this journey” — how your goals and preferences show up in the design; optional “your hero’s arc” summary.

---

## 5. Admin: Journey Parameters & Location

**Admin-only features:**

1. **Journey parameters (global or per-location):**
   - Min/max **duration** (e.g. 1 day to 7 days).
   - Default **start/end time** constraints.
   - Allowed **modalities** or intensity options.

2. **Location management:**
   - **Locations** (e.g. Nevada City) with name, address, status (active/coming soon).
   - Per location, **rich description** for the AI:
     - **Spaces:** Name, description, capacity, atmosphere, suggested use (e.g. “Meditation Room: soundproofed, cushions, dim light; ideal for opening/closing circles”).
     - **Amenities:** Kitchen, outdoor areas, fire pit, sauna, etc.
     - **Atmosphere:** General vibe, landscape, cultural or spiritual context.
     - **Practical:** Parking, accessibility, seasonal notes.
   - This content is **included in the AI context** when a user selects that location so the generated journey references real spaces and amenities.

3. **Content for AI:**
   - Optional **global narrative guidelines** or mythopoetic frameworks (e.g. hero’s journey stages, archetypes) so all generated journeys share a coherent language.

UI: Extend existing **Admin** page (or add tabs/sections) for “Journey settings” and “Locations” (CRUD for locations and their space/amenity/atmosphere text). Reuse existing design system (cards, forms, buttons).

---

## 6. Data Model (Conceptual)

Align with existing stack (Supabase/Postgres). New or extended entities:

- **journeys**  
  - id, host_id (user), title, type (solo | group), status (draft | collecting_inputs | generating | ready | archived)  
  - start_at, end_at (timestamptz)  
  - location_id (FK to locations, nullable)  
  - selected_modalities (jsonb or array)  
  - created_at, updated_at  

- **journey_participants**  
  - journey_id, user_id, role (host | invitee), invited_at, joined_at  
  - For group: one row per invitee/host.

- **journey_inputs**  
  - journey_id, user_id (who provided the input)  
  - goals_text (text, from text + dictation)  
  - food_preferences (text or jsonb)  
  - other_preferences (jsonb: intensity, themes, accessibility, etc.)  
  - modality_interests (optional array)  
  - completed_at  

- **journey_outputs**  
  - journey_id, version (if we support regeneration)  
  - narrative_arc (text or structured json)  
  - schedule (jsonb: day/time blocks, space, activity, narrative beat)  
  - spaces_decor (jsonb)  
  - memorabilia_sacred_objects (jsonb array)  
  - rituals (jsonb array)  
  - moodboard (urls or asset ids)  
  - generated_images (urls or asset ids)  
  - personal_arcs (jsonb, keyed by user_id for group; optional)  
  - generated_at, model_used  

- **locations**  
  - id, slug, name, address, status, sort_order  
  - description_for_ai (long text: atmosphere, context)  
  - created_at, updated_at  

- **location_spaces**  
  - location_id, name, description_for_ai, capacity, suggested_use, sort_order  

- **location_amenities**  
  - location_id, name, description_for_ai (optional)  

- **journey_invites**  
  - journey_id, email, token, status (pending | accepted | declined), expires_at  

- **admin_settings** (optional)  
  - key (e.g. journey_max_days, journey_min_days, default_location_id)  
  - value (jsonb)  

Existing **users** table stays; optionally add role `admin` / `instructor` (already present) for journey admin.

---

## 7. AI Integration

- **Input to AI:**  
  Concatenated structured context: journey type (solo/group), timeframe, selected modalities, all participants’ goals and preferences (for group), location description + spaces + amenities, admin narrative guidelines.  
  **Output from AI:**  
  Structured JSON matching `journey_outputs` (narrative arc, schedule, spaces/decor, memorabilia, rituals, moodboard concept, image prompts).

- **Image generation:**  
  Either: (1) AI returns **image prompts** and a separate service (e.g. DALL·E, Stable Diffusion, or internal API) generates assets stored in Supabase Storage; or (2) end-to-end API that returns image URLs. Store references in `journey_outputs.generated_images` and optionally in `moodboard`.

- **Moodboard:**  
  Can be: (1) AI-generated images only; (2) AI-suggested keywords + curated stock or library images; (3) mix. Stored as list of URLs or asset ids in `journey_outputs.moodboard`.

- **Dictation:**  
  Client-side (e.g. Web Speech API) to transcribe speech into the goals field; no need to send audio to backend if transcription is done in browser.

---

## 8. UI/UX Consistency (Same Design Aesthetic)

- **Layout:** Same `layout.tsx` (Nav + Footer + Providers), same `page-wrap`, `container`, section padding — so when merged, Journey lives in the same shell.
- **Typography & components:** Reuse `--font-serif`, `--font-mono`, `--font-sans`, `--gold`, `--ink`, `--surface`, `.card`, `.btn`, `.form-*`, `.eyebrow`, `.section`, etc.
- **Journey as a tab (after merge):** Nav (and/or dashboard) gets a **Journey** tab/link. Under it: “My Journeys,” “Create Journey,” and journey detail/experience pages. Learning (Courses, Curriculum, Schedule) stays as today; no need to change learning nav for the current phase.
- **For now (Journey-only build):** Implement Journey routes and UI in isolation. Use the same layout and styles so that when we add the “Journey” tab to the app, we simply expose these routes (e.g. under `/journeys`).
- **Suggested Journey routes:**
  - `/journeys` — List “My Journeys” + primary CTA “Design a Journey.”
  - `/journeys/new` — Multi-step Create Journey flow (type → time → modalities → goals → preferences → location → generate).
  - `/journeys/[id]` — View/edit journey; for group: invite, input status, trigger generation.
  - `/journeys/[id]/input` — Invitee: “Complete your input for this journey.”
  - `/journeys/[id]/experience` — Generated experience design (narrative, schedule, spaces, objects, moodboard, images); Collective vs Personal tabs for group.
- **Admin:** Extend `/admin` with “Journey settings” and “Locations” (location CRUD + space/amenity/atmosphere for AI).

---

## 9. Feature Summary Checklist

| Feature | Description |
|--------|-------------|
| Login / Auth | Use existing Supabase auth (unchanged). |
| Create Journey | Solo or group; timeframe (days/nights, start/end); modalities; goals (text + dictation); food & other preferences; optional location. |
| Goals | Text field + optional dictation (browser speech-to-text). |
| Preferences | Food, dietary, intensity, themes, accessibility; extensible (e.g. jsonb). |
| Multi-user (group) | Host invites by email/link; invitees complete their own inputs; AI merges all into one collective design. |
| Personal vs collective view | For group: show “Collective experience design” and “Your thread” / “Personal arc” derived from own goals. |
| AI output | Narrative arc, schedule, spaces/decor, memorabilia & sacred objects, rituals, moodboard, generated images. |
| Generated images & moodboard | AI-generated images for key moments; moodboard (generated or curated) in output view. |
| Admin: journey parameters | Min/max duration, time constraints, allowed modalities (global or per location). |
| Admin: location content | Locations + spaces + amenities + atmosphere text for AI to tailor journey to site. |
| Design consistency | Same globals.css, fonts, colors, components, section/card patterns as current site. |

---

## 10. Out of Scope (V1)

- Payment / checkout for “booking” a journey (can be added later).
- Live facilitation tools (e.g. in-session timers, prompts on a second screen) — future.
- Public discovery of “templates” or pre-designed journeys — future.
- Mobile app — web-first, responsive.

---

## 11. Success Metrics (Suggested)

- Number of journeys created (solo vs group).
- Completion rate: started creation → submitted for generation.
- For group: invite acceptance and input completion rate.
- User feedback on “usability of the experience design” (survey or NPS).
- Admin: number of locations configured and frequency of location-based journeys.

---

## 12. Implementation Phases (Suggested)

**Phase 1 — Foundation (Journey only)**  
- Data model (Supabase migrations for journeys, participants, inputs, outputs, locations, location_spaces, location_amenities, invites).  
- Create Journey flow (solo only): type, timeframe, modalities, goals (text only), preferences, location selector.  
- AI integration: prompt + structured output (narrative, schedule, spaces, objects, rituals); store in `journey_outputs`.  
- View experience design page (narrative + schedule + spaces + objects + rituals; no images yet).  
- Journey hub: “My Journeys” list and “Create Journey” CTA (under `/journeys`). Reuse existing layout and styles; no nav merge yet.  
- Design: reuse existing components and styles everywhere.

**Phase 2 — Rich output & admin**  
- Moodboard (AI-suggested + stored refs).  
- Generated images (prompts from AI → image API → Supabase Storage; display on experience page).  
- Admin: journey parameters (duration bounds, etc.).  
- Admin: location CRUD and “description for AI” (spaces, amenities, atmosphere).  
- Pass location context into AI so generated journeys reference real spaces.

**Phase 3 — Group & personal arc**  
- Group journey type; invite flow (email + link); invitee input page.  
- “All inputs in” → generate with aggregated data; store collective output.  
- Personal arc: per-participant summary or “your thread” in the narrative (AI or rule-based from goals).  
- Collective vs Personal tabs on experience design view.

**Phase 4 — Polish**  
- Dictation for goals (Web Speech API or similar).  
- Email notifications (invite, “your journey is ready”).  
- Accessibility and responsive polish.  
- Optional: templates or “journey starters” for quick creation.

---

This PRD is the source of truth for the **Journey** product. Build it first in isolation (same stack: Next.js, Supabase, auth, design system). When ready, add a **Journey** tab to the main app and merge so users have both Learning and Journey in one platform.
