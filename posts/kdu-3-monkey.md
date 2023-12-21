---
title: Announcing Kdu v3 "Monkey"
date: 2022-12-17
author: NKDuy
gravatar: bd037185b042fdcaf1f6b701935b4baaf690d728c2c6f77b067bdcb96504ff93
twitter: ''
facebook: 'khanhduy1407'
github: 'khanhduy1407'
---

<p align="center">
  <img width="150" src="/assets/kdu-3-monkey.png" alt="one-piece-logo">
</p>

Today we are proud to announce the official release of Kdu.js v3.0 "Monkey". This new major version of the framework provides improved performance, smaller bundle sizes, better TypeScript integration, new APIs for tackling large scale use cases, and a solid foundation for long-term future iterations of the framework.

---

## Taking the "Progressive Framework" Concept Further

Kdu had a simple mission from its humble beginning: to be an approachable framework that anyone can quickly learn. As our user base grew, the framework also grew in scope to adapt to the increasing demands. Over time, it evolved into what we call a "Progressive Framework": a framework that can be learned and adopted incrementally, while providing continued support as the user tackles more and more demanding scenarios.

### Layered internal modules

Kdu v3.0 core can still be used via a simple `<script>` tag, but its internals has been re-written from the ground up into a collection of decoupled modules. The new architecture provides better maintainability, and allows end users to shave off up to half of the runtime size via tree-shaking.

These modules also exposes lower-level APIs that unlocks many advanced use cases:

- The compiler supports custom AST transforms for build-time customizations.
- The core runtime provides first-class API for creating custom renderers targeting different render targets . The default DOM renderer is built using the same API.
- The `@kdujs/reactivity` module exports functions that provide direct access to Kdu's reactivity system, and can be used as a standalone package. It can be used to pair with other templating solutions. or even in non-UI scenarios.

### New APIs for tackling scale

The Kdu v2.x Object-based API is largely intact in Kdu 3. However, v3.0 also introduces the [Composition API](https://kdu-js.web.app/guide/composition-api-introduction.html) - a new set of APIs aimed at addressing the pain points of Kdu usage in large scale applications. The Composition API builds on top of the reactivity API and enables logic composition and reuse similar to React hooks, more flexible code organization patterns, and more reliable type inference than the 2.x Object-based API.

Composition API can also be used with Kdu v2.x via the `@kdujs/composition-api` plugin, and there are already Composition API utility libraries that work for both Kdu v2 and v3 (e.g. `kduse`).

### Performance Improvements

Kdu v3 has demonstrated significant performance improvements over Kdu v2 in terms of bundle size (up to 41% lighter with tree-shaking), initial render (up to 55% faster), updates (up to 133% faster), and memory usage (up to 54% less).

In Kdu v3, we have taken the approach of "compiler-informed Virtual DOM": the template compiler performs aggressive optimizations and generates render function code that hoists static content, leaves runtime hints for binding types, and most importantly, flattens the dynamic nodes inside a template to reduce the cost of runtime traversal. The user therefore gets the best of both worlds: compiler-optimized performance from templates, or direct control via manual render functions when the use case demands.

### Improved TypeScript integration

Kdu v3's codebase is written in TypeScript, with automatically generated, tested, and bundled type definitions so they are always up-to-date. Composition API works great with type inference. [Kocan](https://marketplace.visualstudio.com/items?itemName=Kdu-Code.kocan), our official VSCode extension, now supports template expression and props type checking leveraging Kdu v3's improved internal typing. Oh, and Kdu 3's typing fully supports TSX if that's your preference.

### Experimental Features

We have proposed two new features for Singe-File Components (SFC, aka `*.kdu` files):

- `<script setup>`: syntactic sugar for using Composition API inside SFCs.
- `<style vars>`: state-driven CSS variables inside SFCs.

These features are already implemented and available in Kdu v3.0, but are provided only for the purpose of gathering feedback.

We have also implemented a currently undocumented `<Suspense>` component, which allows waiting on nested async dependencies (async components or component with `async setup()`) on initial render or branch switch.

## Phased Release Process

The release of Kdu v3.0 marks the general readiness of the framework. While some of the frameworks sub projects may still need further work to reach stable status (specifically router and Kdux integration in the devtools), we believe it's suitable to start new, green-field projects with Kdu v3 today. We also encourage library authors to start upgrading your projects to support Kdu 3.

### Next Steps

For the near term after release, we will focus on:

- Migration build
- IE11 support
- Router and Kdux integration in new devtools
- Further improvements to template type inference in [Kocan](https://marketplace.visualstudio.com/items?itemName=Kdu-Code.kocan)

For the time being, the documentation websites, GitHub branches, and npm dist tags for Kdu v3 and v3-targeting projects will remain under `next`-denoted status. This means `npm install kdu` will still install Kdu v2.x and `npm install kdu@next` will install Kdu v3.

## Trying It Out

To learn more about Kdu v3.0, check out our [new documentation website](https://kdu-js.web.app/).
