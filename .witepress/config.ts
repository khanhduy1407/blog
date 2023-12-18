import { defineConfig } from 'witepress'

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
        href: '/favicon.ico'
      }
    ]
  ]
})
