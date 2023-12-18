---
title: KduJS - The Kdu Framework
date: 2022-01-18
author: NKDuy
gravatar: bd037185b042fdcaf1f6b701935b4baaf690d728c2c6f77b067bdcb96504ff93
twitter: ''
facebook: 'khanhduy1407'
github: 'khanhduy1407'
---

Kdu is a progressive framework for building user interfaces. Unlike other monolithic frameworks, Kdu is designed from the ground up to be incrementally adoptable. The core library is focused on the view layer only, and is easy to pick up and integrate with other libraries or existing projects.

---

## What is Kdu.js?

Kdu is a progressive framework for building user interfaces. Unlike other monolithic frameworks, Kdu is designed from the ground up to be incrementally adoptable. The core library is focused on the view layer only, and is easy to pick up and integrate with other libraries or existing projects. On the other hand, Kdu is also perfectly capable of powering sophisticated Single-Page Applications when used in combination with [modern tooling](https://kdujs-v2.web.app/v2/guide/single-file-components.html).

## Installation

### Using NPM or Yarn

NPM is the recommended installation method when building large scale applications with Kdu. It pairs nicely with module bundlers such as [Webpack](https://webpack.js.org/) or [Browserify](http://browserify.org/). Kdu also provides accompanying tools for authoring [Single File Components](https://kdujs-v2.web.app/v2/guide/single-file-components.html).

```sh
# latest stable
$ npm install kdu@^2

# or yarn
$ npm add kdu@^2
```

### Using Kdu CLI

Kdu provides an official CLI for quickly scaffolding ambitious Single Page Applications. It provides batteries-included build setups for a modern frontend workflow. It takes only a few minutes to get up and running with hot-reload, lint-on-save, and production-ready builds. See [the Kdu CLI docs](https://kdujs-cli.web.app/) for more details.

## Features

Following are the features available with KduJS.

### Virtual DOM

KduJS makes the use of virtual DOM, which is also used by other frameworks such as React, Ember, etc. The changes are not made to the DOM, instead a replica of the DOM is created which is present in the form of JavaScript data structures. Whenever any changes are to be made, they are made to the JavaScript data structures and the latter is compared with the original data structure. The final changes are then updated to the real DOM, which the user will see changing. This is good in terms of optimization, it is less expensive and the changes can be made at a faster rate.

### Data Binding

The data binding feature helps manipulate or assign values to HTML attributes, change the style, assign classes with the help of binding directive called **k-bind** available with KduJS.

### Components

Components are one of the important features of KduJS that helps create custom elements, which can be reused in HTML.

### Event Handling

**k-on** is the attribute added to the DOM elements to listen to the events in KduJS.

### Animation/Transition

KduJS provides various ways to apply transition to HTML elements when they are added/updated or removed from the DOM. KduJS has a built-in transition component that needs to be wrapped around the element for transition effect. We can easily add third party animation libraries and also add more interactivity to the interface.

### Computed Properties

This is one of the important features of KduJS. It helps to listen to the changes made to the UI elements and performs the necessary calculations. There is no need of additional coding for this.

### Templates

KduJS provides HTML-based templates that bind the DOM with the Kdu instance data. Kdu compiles the templates into virtual DOM Render functions. We can make use of the template of the render functions and to do so we have to replace the template with the render function.

### Directives

KduJS has built-in directives such as k-if, k-else, k-show, k-on, k-bind, and k-model, which are used to perform various actions on the frontend.

### Watchers

Watchers are applied to data that changes. For example, form input elements. Here, we don’t have to add any additional events. Watcher takes care of handling any data changes making the code simple and fast.

### Routing

Navigation between pages is performed with the help of kdu-router.

### Lightweight

KduJS script is very lightweight and the performance is also very fast.

### Kdu-CLI

KduJS can be installed at the command line using the kdu-cli command line interface. It helps to build and compile the project easily using kdu-cli.
