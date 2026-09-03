---
target: src/app/(public)/collaborations/page.tsx
total_score: 19
max_score: 32
na_heuristics: 7,10
p0_count: 0
p1_count: 3
target_identity: "file:/workspace/src/app/(public)/collaborations/page.tsx"
target_fingerprint: "sha256:08e94f4fcef2082d55b31ea0519c534528469af1c1388e5d9eb2029ace2e90e8"
target_path: /workspace/src/app/(public)/collaborations/page.tsx
timestamp: 2026-09-03T12-47-56Z
slug: src-app-public-collaborations-page-tsx
---
Method: dual-agent (A: bc-98a200cb-60d2-5c21-8ec7-14137b006ca8 · B: bc-713b9fd4-4de4-5f49-809c-d0d751a7caee)

#### Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2 | Collaborations missing from primary nav / no active state |
| 2 | Match System / Real World | 3 | “Rush profile” mislabel on news URL; visible PI naming |
| 3 | User Control and Freedom | 3 | Solid exits via header/footer |
| 4 | Consistency and Standards | 2 | Diverges from /team (no teal bars, portraits, gutter) |
| 5 | Error Prevention | 2 | Duplicate same-URL links; misleading profile label |
| 6 | Recognition Rather Than Recall | 2 | No faces; icon-only socials; areas only via scroll |
| 7 | Flexibility and Efficiency | n/a | Persuade surface |
| 8 | Aesthetic and Minimalist Design | 2 | Clean but sterile; tiny ALL-CAPS roles; flat ivory |
| 9 | Error Recovery | 3 | Empty state present; little interactive surface |
| 10 | Help and Documentation | n/a | Persuade surface |
| **Total** | | **19/32** | **Acceptable** |

#### Design Specificity Verdict

**LLM assessment**: Partially Rush-authored tokens, category-interchangeable composition. Mono eyebrow and dark-green H1 read as RICCC; strip nav and the page is a generic academic bio dump—no imagery, no teal accent bars, no photos/initials unlike /team.

**Deterministic scan**: CLI detect.mjs exit 0, `[]` findings on page source. Browser inject reported 21 anti-patterns; cream-palette, Inter, gradient-text, all-caps-body, and most line-length hits treated as false positives (Rush ivory system + intentional mono labels).

**Visual overlays**: No reliable user-visible overlay in a Human tab (CSP blocked external detect.js; headless inline inject only).

#### Overall Impression
Competent institutional reading page that underperforms /team as a Persuade surface. Biggest opportunity: match team visual craft (area hierarchy, faces, teal rules) and fix IA/nav + investigator-neutral copy.

#### What's Working
1. Area IA (EM → Critical Care → Respiratory → HCD) is domain-true and scannable.
2. Brand tokens (mono eyebrows, dark-green type, max-w-3xl measure) are correct.
3. Footer CTAs use adequate touch height; Contact is visually primary.

#### Priority Issues

**[P1] Orphan route in IA**
- What: Collaborations only in footer + team teaser; missing from NAV_ITEMS / header active state.
- Why: First-timers cannot discover or orient on this surface.
- Fix: Add to primary/mobile nav with aria-current on this path.
- Suggested command: /impeccable polish (nav) / onboard

**[P1] Persuade underbuild vs /team**
- What: No photos/initials, no teal bars, no atmospheric plane; first viewport fails brand test without nav.
- Why: Dedicated showcase looks weaker than the team teaser that links here.
- Fix: Align with team patterns—teal rules, portrait/initial rows, stronger section titles.
- Suggested command: /impeccable bolder / layout / polish

**[P1] Investigator names in visible hero/body**
- What: Hero names Rojas/Buell; bios repeat PI partners in visible copy.
- Why: Violates investigator-neutral visible branding rule.
- Fix: Visible copy → “RICCC investigators”; keep names in meta/JSON-LD only.
- Suggested command: /impeccable clarify / polish

**[P2] Duplicate + misleading outbound links**
- What: Globe + “Rush profile” same href; Jie Li URL is a news story.
- Why: Mis-taps and broken trust on “profile” label.
- Fix: Deduplicate links; label news as feature; enlarge tap targets.
- Suggested command: /impeccable harden / polish

**[P2] Area H2 / role typography collapse**
- What: Area H2s are eyebrow-weight; roles at text-[10px] wrap badly on mobile.
- Why: Hierarchy flattens; mobile readability suffers.
- Fix: Real section titles + teal bar; sentence-case readable roles.
- Suggested command: /impeccable typeset / polish

#### Persona Red Flags
**Jordan**: No header Collaborations; bio wall with no clear next action until footer; icon-only socials.
**Casey**: Long full-bio scroll; 10px roles; 28×28 social targets; Contact only at end.
**Riley**: Mislabeled news as Rush profile; dual same-URL links; aria ids with spaces; no Person JSON-LD.

#### Minor Observations
- CTA labels terse; no in-page area jump links; CollectionPage-only JSON-LD; repetitive bio closers; missing lg:ml-12 craft from team.

#### Questions to Consider
1. If this is the multidisciplinary showcase, why does /team still look more persuasive?
2. Should collaborators read as RICCC’s network of equals, or satellites of named PIs?
3. What if first viewport showed area chips + faces with bios on demand?
