import { defineConfig } from 'witepress'
import { genFeed } from './genFeed.js'

export default defineConfig({
  base: '/blog/',

  title: 'NKDuy Blog',
  description: 'The offical blog for the NKDuy project',

  cleanUrls: true,

  head: [
    [
      'link',
      {
        rel: 'icon',
        type: 'image/x-icon',
        href: '/blog/favicon.ico'
      }
    ]
  ],

  buildEnd: genFeed
})
