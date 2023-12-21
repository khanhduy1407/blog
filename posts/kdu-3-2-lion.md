---
title: Kdu v3.2 "Lion"
date: 2022-12-18
author: NKDuy
gravatar: bd037185b042fdcaf1f6b701935b4baaf690d728c2c6f77b067bdcb96504ff93
twitter: ''
facebook: 'khanhduy1407'
github: 'khanhduy1407'
---

<p align="center">
  <img width="150" src="/assets/kdu-3-2-lion.png" alt="one-piece-logo">
</p>

We are excited to announce the release of Kdu.js v3.2 "Lion"! This release includes many significant new features and performance improvements, and contains no breaking changes.

---

## New SFC Features

Two new features for Single File Components (SFCs, aka `*.kdu` files) have graduated from experimental status and are now considered stable:

- `<script setup>` is a compile-time syntactic sugar that greatly improves the ergonomics when using Composition API inside SFCs.

- `<style> k-bind` enables component state-driven dynamic CSS values in SFC `<style>` tags.

Here is an example component using these two new features together:

```kdu
<script setup>
import { ref } from 'kdu'

const color = ref('red')
</script>

<template>
  <button @click="color = color === 'red' ? 'green' : 'red'">
    Color is: {{ color }}
  </button>
</template>

<style scoped>
button {
  color: k-bind(color);
}
</style>
```

Try it out in the [SFC Playground](https://kdujs-sfc.web.app/#eNqFkMFugzAQRH9l5QuJFOBOIW3V3/AFzKISwLZ2TaMK8e9dDJWi9pCTNeOZ5/Uu6t37bGhnVaiSDfU+AGOY/VXbfvKOAixA2MEKHbkJEokm2mprnOUAxo2OoNoSp4SwTc7alvnOEYKIgJMf64CiAMpmDsFZeDNjb4ZKq9/+cVYVRAq8QtKMMyZQ7IZWsQ/wEYM9F7AsR2tdIzrf2ZIr84dHRXL4HhHYOI+tOMcMy9aKhAKGtOlte4rq/KKtEOUXW+2qLmrfQzrVPruxs7Kp2NXHBWsl0+zjaSX72bRWnyF4LvJcjBun3Jnsjk1We785Gc029BNmyFPakLszksC1ujxwcjG/kFJC2yIhPeP+if9jb2j52arWH4kLrMk=), or read their respective documentations:

- [`<script setup>`](https://kdu-js.web.app/api/sfc-script-setup.html)
- [`<style> k-bind`](https://kdu-js.web.app/api/sfc-css-features.html#state-driven-dynamic-css)

## Web Components

Kdu v3.2 introduces a new `defineCustomElement` method for easily creating native [custom elements](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements) using Kdu component APIs:

```js
import { defineCustomElement } from 'kdu'

const MyKduElement = defineCustomElement({
  // normal Kdu component options here
})

// Register the custom element.
// After registration, all `<my-kdu-element>` tags
// on the page will be upgraded.
customElements.define('my-kdu-element', MyKduElement)
```

This API allows developers to create Kdu-powered UI component libraries that can be used with any framework, or no framework at all. We have also added a new section in our docs on [consuming and creating Web Components in Kdu](https://kdu-js.web.app/guide/extras/web-components.html).

## Performance Improvements

v3.2 includes some significant performance improvements to Kdu's reactivity system. Specifically:

- More efficient ref implementation (~260% faster read / ~50% faster write)
- ~40% faster dependency tracking
- ~17% less memory usage

The template compiler also received a number of improvements:

- ~200% faster creation of plain element KNodes
- More aggressive constant hoisting

Finally, there is a new [`k-memo` directive](https://kdu-js.web.app/api/built-in-directives.html#k-memo) that provides the ability to memoize part of the template tree. A `k-memo` hit allows Kdu to skip not only the Virtual DOM diffing, but the creation of new KNodes altogether. Although rarely needed, it provides an escape hatch to squeeze out maximum performance in certain scenarios, for example large `k-for` lists.

## Server-side Rendering

The `@kdujs/server-renderer` package in v3.2 now ships an ES module build which is also decoupled from Node.js built-ins. This makes it possible to bundle and leverage `@kdujs/server-renderer` for use inside non-Node.js runtimes such as [CloudFlare Workers](https://developers.cloudflare.com/workers/) or Service Workers.

We also improved the streaming render APIs, with new methods for rendering to the [Web Streams API](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API).

## Effect Scope API

v3.2 introduces a new [Effect Scope API](https://kdu-js.web.app/api/reactivity-advanced.html#effectscope) for directly controlling the disposal timing of reactive effects (computed and watchers). It makes it easier to leverage Kdu's reactivity API out of a component context, and also unlocks some advanced use cases inside components.
