# Minimal reproducer — `useContext` null during SSG

Paste these files into a fresh GitHub repo, then:

```bash
pnpm install
pnpm --filter app-a build
# Expected: crashes with `TypeError: Cannot read properties of null (reading 'useContext')`
# during "Generating static pages (0/1)".
```

## Shape

```
minimal-repro/
├── package.json          # root, declares pnpm overrides pinning react@18.2.0
├── pnpm-workspace.yaml
├── app-a/                # Next 14.2.35 App Router app
│   ├── package.json
│   ├── next.config.js
│   ├── tsconfig.json
│   └── app/
│       ├── layout.tsx    # bare html/body/children — no providers
│       └── page.tsx      # imports Chip from workspace package
├── app-b/                # identical to app-a — proves it's not single-app
└── packages/
    └── shared-ui/        # workspace:* dep with a "use client" Chip
        ├── package.json
        └── src/
            ├── index.ts
            └── chip.tsx
```

## What makes this a useful reproducer

- **Two apps** — shows this is workspace-level, not app-level.
- **Shared "use client" component** — forces Next to traverse the RSC client boundary during SSG, which is where the null dispatcher hits.
- **Root layout is trivial** — no NextIntlClientProvider, no context, no hooks. This proves the crash is not caused by user-land providers.
- **Pinned React 18.2.0** — rules out the 18.2.0 ↔ 18.3.1 hypothesis.

## Things to try on the reproducer (if you want to narrow further before filing)

1. Add `shamefully-hoist=true` or `node-linker=hoisted` to `.npmrc` and rebuild — if this fixes it, the bug is in pnpm's symlink layout interaction with Next's SSG worker.
2. Swap `pnpm` for `npm` and rebuild — if this fixes it, confirms the above.
3. Downgrade to `next@13.5.6` + keep everything else — if this fixes it, regression was introduced in the Next 14 App Router runtime.
