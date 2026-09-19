# SkillLaunch Part-Time Collaboration — Checkpoint

## Purpose

This checkpoint captures the current UI architecture for connecting SkillLaunch with partner-led projects such as PixelCards.

## Navigation Hierarchy

```
PART-TIME PROJECTS
        |
        +-- 24/7 Jobs
        |      |
        |      +--> /part-time-projects
        |
        +-- Collaborated Projects
        |      |
        |      +--> /part-time-projects
        |
        +-- How It Works
        |      |
        |      +--> /part-time-projects
        |
        +-- Earn With Us
               |
               +--> /part-time-projects
```

## Collaboration Hub

`/part-time-projects` is the central Part-Time Projects hub.

The hub is designed as a scalable container for multiple collaborations. It does not treat one template editor as the entire Part-Time Projects feature.

Current featured collaboration:

```
/part-time-projects
        |
        +--> PixelCards project card
                |
                +--> /part-time-projects/pixelcards
```

## PixelCards Project Page

`/part-time-projects/pixelcards` is the project-detail layer.

It explains:

- what the PixelCards collaboration is
- available design categories
- the student-side workflow
- the customer-side workflow
- how approved/reusable assets can participate in the project ecosystem
- the planned connection to the partner's specialized studio/app

The PixelCards page is intentionally separate from the actual partner editor.

## Future Partner Link

The intended architecture is:

```
SkillLaunch
   |
   | discovery
   | project participation
   | student workflow
   | marketplace
   v
Partner Project
   |
   | deep link / context
   | future API / SSO where appropriate
   v
Partner Studio / Template Engine
```

For the first UI phase, the connection can be a normal route/deep link.

Later, the integration can evolve without redesigning the SkillLaunch hub:

```
Route Link
   -> Context-Aware Deep Link
      -> API Integration
         -> Optional SSO / Account Linking
```

## PixelCards Categories

The current concept includes:

- Visiting Cards
- Business Cards
- Banners & Posters
- Invitations
- Certificates
- Social Designs

## Scalability

Future collaborations should be added as additional large project cards inside the same hub:

```
/part-time-projects
   |
   +--> PixelCards
   +--> Future Collaboration A
   +--> Future Collaboration B
   +--> Future Collaboration C
```

The hub remains stable while individual partner projects can evolve independently.

## Current Implementation Boundary

This checkpoint is UI-first.

Not included yet:

- backend/database integration for the collaboration layer
- payments
- royalty accounting
- production API integration with PixelCards
- SSO/account federation

Those are planned future layers.

## Checkpoint

Base homepage branch state:

`feat/homepage-dual-theme-hybrid-v4`

Checkpoint branch:

`checkpoint/part-time-collaboration-v1`

This branch is intended to be shared for review of the Part-Time Projects and collaboration architecture.
