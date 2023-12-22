---
title: Announcing Kdu v3.3 "Snowflake"
date: 2023-12-13
author: NKDuy
gravatar: bd037185b042fdcaf1f6b701935b4baaf690d728c2c6f77b067bdcb96504ff93
twitter: ''
facebook: 'khanhduy1407'
github: 'khanhduy1407'
---

Today we're excited to announce the release of Kdu 3.3 "Snowflake"!

<p align="center">
  <img width="150" src="https://github.com/khanhduy1407/blog/assets/68154054/d31dffad-d524-4c70-a7d0-d74a2cc81116" alt="kdu-3-3-snowflake">
</p>

This release is focused on developer experience improvements - in particular, SFC `<script setup>` usage with TypeScript. This post provides an overview of the highlighted features in v3.3.

---

[[TOC]]

## `<script setup>` + TypeScript DX Improvements

### Imported and Complex Types Support in Macros

Previously, types used in the type parameter position of `defineProps` and `defineEmits` were limited to local types, and only supported type literals and interfaces. This is because Kdu needs to be able to analyze the properties on the props interface in order to generate corresponding runtime options.

This limitation is now resolved in v3.3. The compiler can now resolve imported types, and supports a limited set of complex types:

```kdu
<script setup lang="ts">
import type { Props } from './foo'

// imported + intersection type
defineProps<Props & { extraProp?: string }>()
</script>
```

Do note that complex types support is AST-based and therefore not 100% comprehensive. Some complex types that require actual type analysis, e.g. conditional types, are not supported. You can use conditional types for the type of a single prop, but not the entire props object.

### Generic Components

Components using `<script setup>` can now accept generic type parameters via the `generic` attribute:

```kdu
<script setup lang="ts" generic="T">
defineProps<{
  items: T[]
  selected: T
}>()
</script>
```

The value of `generic` works exactly the same as the parameter list between `<...>` in TypeScript. For example, you can use multiple parameters, `extends` constraints, default types, and reference imported types:

```kdu
<script setup lang="ts" generic="T extends string | number, U extends Item">
import type { Item } from './types'
defineProps<{
  id: T
  list: U[]
}>()
</script>
```

This feature previously required explicit opt-in, but is now enabled by default in the latest version of kocan / kdu-tsc.

### More Ergonomic `defineEmits`

Previously, the type parameter for `defineEmits` only supports the call signature syntax:

```ts
// BEFORE
const emit = defineEmits<{
  (e: 'foo', id: number): void
  (e: 'bar', name: string, ...rest: any[]): void
}>()
```

The type matches the return type for `emit`, but is a bit verbose and awkward to write. v3.3 introduces a more ergonomic way of declaring emits with types:

```ts
// AFTER
const emit = defineEmits<{
  foo: [id: number]
  bar: [name: string, ...rest: any[]]
}>()
```

In the type literal, the key is the event name and the value is an array type specifying the additional arguments. Although not required, you can use the [labeled tuple elements](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-0.html#labeled-tuple-elements) for explicitness, like in the example above.

The call signature syntax is still supported.

### Typed Slots with `defineSlots`

The new `defineSlots` macro can be used to declare expected slots and their respective expected slot props:

```kdu
<script setup lang="ts">
defineSlots<{
  default?: (props: { msg: string }) => any
  item?: (props: { id: number }) => any
}>()
</script>
```

`defineSlots()` only accepts a type parameter and no runtime arguments. The type parameter should be a type literal where the property key is the slot name, and the value is a slot function. The first argument of the function is the props the slot expects to receive, and its type will be used for slot props in the template. The returning value of `defineSlots` is the same slots object returned from `useSlots`.

Some current limitations:

- Required slots checking is not yet implemented in kocan / kdu-tsc.
- Slot function return type is currently ignored and can be `any`, but we may leverage it for slot content checking in the future.

There is also a corresponding `slots` option for `defineComponent` usage. Both APIs have no runtime implications and serve purely as type hints for IDEs and `kdu-tsc`.

## Experimental Features

### Reactive Props Destructure

Previously part of the now-dropped Reactivity Transform, reactive props destructure has been split into a separate feature.

The feature allows destructured props to retain reactivity, and provides a more ergonomic way to declare props default values:

```kdu
<script setup>
import { watchEffect } from 'kdu'

const { msg = 'hello' } = defineProps(['msg'])

watchEffect(() => {
  // accessing `msg` in watchers and computed getters
  // tracks it as a dependency, just like accessing `props.msg`
  console.log(`msg is: ${msg}`)
})
</script>

<template>{{ msg }}</template>
```

This feature is experimental and requires explicit opt-in.

### `defineModel`

Previously, for a component to support two-way binding with `k-model`, it needs to (1) declare a prop and (2) emit a corresponding `update:propName` event when it intends to update the prop:

```kdu
<!-- BEFORE -->
<script setup>
const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])
console.log(props.modelValue)

function onInput(e) {
  emit('update:modelValue', e.target.value)
}
</script>

<template>
  <input :value="modelValue" @input="onInput" />
</template>
```

v3.3 simplifies the usage with the new `defineModel` macro. The macro automatically registers a prop, and returns a ref that can be directly mutated:

```kdu
<!-- AFTER -->
<script setup>
const modelValue = defineModel()
console.log(modelValue.value)
</script>

<template>
  <input k-model="modelValue" />
</template>
```

This feature is experimental and requires explicit opt-in.

## Other Notable Features

### `defineOptions`

The new `defineOptions` macro allows declaring component options directly in `<script setup>`, without requiring a separate `<script>` block:

```kdu
<script setup>
defineOptions({ inheritAttrs: false })
</script>
```

### Better Getter Support with `toRef` and `toValue`

`toRef` has been enhanced to support normalizing values / getters / existing refs into refs:

```js
// equivalent to ref(1)
toRef(1)
// creates a readonly ref that calls the getter on .value access
toRef(() => props.foo)
// returns existing refs as-is
toRef(existingRef)
```

Calling `toRef` with a getter is similar to `computed`, but can be more efficient when the getter is just performing property access with no expensive computations.

The new `toValue` utility method provides the opposite, normalizing values / getters / refs into values:

```js
toValue(1) //       --> 1
toValue(ref(1)) //  --> 1
toValue(() => 1) // --> 1
```

`toValue` can be used in composables in place of `unref` so that your composable can accept getters as reactive data sources:

```js
// before: allocating unnecessary intermediate refs
useFeature(computed(() => props.foo))
useFeature(toRef(props, 'foo'))

// after: more efficient and succinct
useFeature(() => props.foo)
```

The relationship between `toRef` and `toValue` is similar to that between `ref` and `unref`, with the main difference being the special handling of getter functions.

### JSX Import Source Support

Currently, Kdu's types automatically registers global JSX typing. This may cause conflict with used together with other libraries that needs JSX type inference, in particular React.

Starting in v3.3, Kdu supports specifying JSX namespace via TypeScript's [jsxImportSource](https://www.typescriptlang.org/tsconfig#jsxImportSource) option. This allows the users to choose global or per-file opt-in based on their use case.

For backwards compatibility, v3.3 still registers JSX namespace globally. **We plan to remove the default global registration in 3.4.** If you are using TSX with Kdu, you should add explicit `jsxImportSource` to your `tsconfig.json` after upgrading to v3.3 to avoid breakage in v3.4.

## Maintenance Infrastructure Improvements

This release builds upon many maintenance infrastructure improvements that allow us to move faster with more confidence:

- 10x faster builds by separating type checking from the rollup build and moving from `rollup-plugin-typescript2` to `rollup-plugin-esbuild`.
- Faster types generation by moving from `@microsoft/api-extractor` to `rollup-plugin-dts`.
