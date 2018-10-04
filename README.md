# md2conf

Markdown to Confluence markup.

Actively maintained (for as long as I use Confluence at work) fork of
[markdown2confluence](https://github.com/chunpu/markdown2confluence) with a
bunch of patches applied.

[![CircleCI](https://circleci.com/gh/zacanger/md2conf.svg?style=svg)](https://circleci.com/gh/zacanger/md2conf)

## Usage

`cat foo.md | npx md2conf > foo.conf`, or `md2conf foo.md > foo.conf`

You can install this globally with `npm i -g md2conf`.

In Vim, you can rewrite your buffer with `:%! npx md2conf`.

[License](./LICENSE.md)
