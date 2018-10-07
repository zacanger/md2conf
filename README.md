# md2conf

Markdown to Confluence markup.

Actively maintained (for as long as I use Confluence at work) fork of
[markdown2confluence](https://github.com/chunpu/markdown2confluence) with a
bunch of patches applied.

[![CircleCI](https://circleci.com/gh/zacanger/md2conf.svg?style=svg)](https://circleci.com/gh/zacanger/md2conf) [![codecov](https://codecov.io/gh/zacanger/md2conf/branch/master/graph/badge.svg)](https://codecov.io/gh/zacanger/md2conf)

## Usage

`npx md2conf < foo.md > foo.conf`, or `npx md2conf foo.md > foo.conf`.

You can install this globally and avoid the extra call to `npx` with `npm i -g
md2conf`.

In Vim, you can rewrite your buffer with `:%! npx md2conf`.

[License](./LICENSE.md)
