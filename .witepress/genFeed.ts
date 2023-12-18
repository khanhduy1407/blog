import path from 'path'
import { writeFileSync } from 'fs'
import { Feed } from 'feed'
import { createContentLoader, type SiteConfig } from 'witepress'

const baseUrl = `https://khanhduy1407.github.io/blog`

export async function genFeed(config: SiteConfig) {
  const feed = new Feed({
    title: 'NKDuy Blog',
    description: 'The official blog for the NKDuy project',
    id: baseUrl,
    link: baseUrl,
    language: 'en',
    image: 'https://github.com/khanhduy1407.png',
    favicon: `${baseUrl}/favicon.ico`,
    copyright: 'Copyright (c) 2019-present, NKDuy'
  })

  const posts = await createContentLoader('posts/*.md', {
    excerpt: true,
    render: true
  }).load()

  posts.sort(
    (a, b) =>
      +new Date(b.frontmatter.date as string) -
      +new Date(a.frontmatter.date as string)
  )

  for (const { url, excerpt, frontmatter, html } of posts) {
    feed.addItem({
      title: frontmatter.title,
      id: `${baseUrl}${url}`,
      link: `${baseUrl}${url}`,
      description: excerpt,
      content: html,
      author: [
        {
          name: frontmatter.author,
          link: frontmatter.twitter
            ? `https://twitter.com/${frontmatter.twitter}`
            : undefined
        }
      ],
      date: frontmatter.date
    })
  }

  writeFileSync(path.join(config.outDir, 'feed.rss'), feed.rss2())
}
