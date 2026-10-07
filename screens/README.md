# Screens

This directory contains page-level UI composition. Each screen has its own
folder and exports a named screen component.

```text
screens/
  home/
    home-screen.tsx
  dashboard/
    dashboard-screen.tsx
```

Files in `app` own routing, metadata, loading states, and route parameters.
They should render the appropriate component from `screens`. Reusable UI
belongs in `components`, while domain logic belongs in `features`.
