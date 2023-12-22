---
title: Kdu v2.7 "Cup Cake" Released
date: 2022-12-10
author: NKDuy
gravatar: bd037185b042fdcaf1f6b701935b4baaf690d728c2c6f77b067bdcb96504ff93
twitter: ''
facebook: 'khanhduy1407'
github: 'khanhduy1407'
---

<p align="center">
  <img width="150" src="https://github.com/khanhduy1407/blog/assets/68154054/ec9f457d-7c88-4be7-bb1f-0ff28d8e8b18" alt="kdu-2-7-cupcake">
</p>

Today we are happy to announce that Kdu v2.7 "Cup Cake" has been released!

---

Despite Kdu v3 now being the default version, we understand that there are still many users who have to stay on Kdu v2 due to dependency compatibility, browser support requirements, or simply not enough bandwidth to upgrade. In Kdu v2.7, we have backported some of the most important features from Kdu v3 so that Kdu v2 users can benefit from them as well.

## Backported Features

- [Composition API](https://kdu-js.web.app/guide/extras/composition-api-faq.html)
- SFC [`<script setup>`](https://kdu-js.web.app/api/sfc-script-setup.html)
- SFC [CSS k-bind](https://kdu-js.web.app/api/sfc-css-features.html#k-bind-in-css)

In addition, the following APIs are also supported:

- `defineComponent()` with improved type inference (compared to `Kdu.extend`)
- `h()`, `useSlot()`, `useAttrs()`, `useCssModules()`
- `set()`, `del()` and `nextTick()` are also provided as named exports in ESM builds.
- The `emits` option is also supported, but only for type-checking purposes (does not affect runtime behavior)

  v2.7 also supports using ESNext syntax in template expressions. When using a build system, the compiled template render function will go through the same loaders / plugins configured for normal JavaScript. This means if you have configured Babel for `.js` files, it will also apply to the expressions in your SFC templates.

### Notes on API exposure

- In ESM builds, these APIs are provided as named exports (and named exports only):

  ```js
  import Kdu, { ref } from 'kdu'

  Kdu.ref // undefined, use named export instead
  ```

- In UMD and CJS builds, these APIs are exposed as properties on the global `Kdu` object.

- When bundling with CJS builds externalized, bundlers should be able to handle ESM interop when externalizing CJS builds.

### Behavior Differences from Kdu 3

The Composition API is backported using Kdu 2's getter/setter-based reactivity system to ensure browser compatibility. This means there are some important behavior differences from Kdu 3's proxy-based system:

- All [Kdu 2 change detection caveats](https://kdujs-v2.web.app/v2/guide/reactivity.html#Change-Detection-Caveats) still apply.

- `reactive()`, `ref()`, and `shallowReactive()` will directly convert original objects instead of creating proxies. This means:

  ```js
  // true in 2.7, false in 3.x
  reactive(foo) === foo
  ```

- `readonly()` **does** create a separate object, but it won't track newly added properties and does not work on arrays.

- Avoid using arrays as root values in `reactive()` because without property access the array's mutation won't be tracked (this will result in a warning).

- Reactivity APIs ignore properties with symbol keys.

In addition, the following features are explicitly **NOT** ported:

- ❌ `createApp()` (Kdu 2 doesn't have isolated app scope)
- ❌ Top-level `await` in `<script setup>` (Kdu 2 does not support async component initialization)
- ❌ TypeScript syntax in template expressions (incompatible w/ Kdu 2 parser)
- ❌ Reactivity transform (still experimental)
- ❌ `expose` option is not supported for options components (but `defineExpose()` is supported in `<script setup>`).

## Upgrade Guide

### Kdu CLI / webpack

1. Upgrade local `@kdujs/cli-xxx` dependencies the latest version in your major version range (if applicable):

   - `~4.0.5` for v4
   - `~5.0.10` for v5

2. Upgrade `kdu` to `^2.7.0`. You can also remove `kdu-template-compiler` from the dependencies - it is no longer needed in 2.7.

3. Check your package manager lockfile to ensure the following dependencies meet the version requirements. They may be transitive dependencies not listed in `package.json`.

   - `kdu-loader`: `^15.9.8`
   - `kdu-demi`: `^0.12.5`

   If not, you will need to remove `node_modules` and the lockfile and perform a fresh install to ensure they are bumped to the latest version.

4. If you were previously using `@kdujs/composition-api`, update imports from it to `kdu` instead. Note that some APIs exported by the plugin, e.g. `createApp`, are not ported in v2.7.

5. Update `eslint-plugin-kdu` to latest version (9+) if you run into unused variable lint errors when using `<script setup>`.

6. The SFC compiler for v2.7 now uses PostCSS 8 (upgraded from 7). PostCSS 8 should be backwards compatible with most plugins, but the upgrade **may** cause issues if you were previously using a custom PostCSS plugin that can only work with PostCSS 7. In such cases, you will need to upgrade the relevant plugins to their PostCSS 8 compatible versions.

### Kocan Compatibility

v2.7 ships improved type definitions so it is no longer necessary to install `@kdujs/runtime-dom` just for Kocan template type inference support. All you need now is the following config in `tsconfig.json`:

```json
{
  // ...
  "kduCompilerOptions": {
    "target": 2.7
  }
}
```

### Devtools Support

Kdu Devtools v6.4.5 has added support for inspecting 2.7 Composition API state, but the extensions may still need a few days to go through review on respective publishing platforms.
