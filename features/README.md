# Features

Place domain-specific code in a folder named after the feature it belongs to.
Keep components, data access, actions, schemas, and types close to that feature.

```text
features/
  example/
    actions/
    components/
    lib/
    types.ts
```

Code shared across multiple features belongs in the root-level `components`,
`config`, or `lib` directories. Route-specific code can be colocated in a
private folder such as `app/dashboard/_components`.
