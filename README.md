# md2conf

Markdown to Confluence markup.

Actively maintained (for as long as I use Confluence at work) fork of
[markdown2confluence](https://github.com/chunpu/markdown2confluence) with a
bunch of patches applied.

[![CircleCI](https://circleci.com/gh/zacanger/md2conf.svg?style=svg)](https://circleci.com/gh/zacanger/md2conf) [![codecov](https://codecov.io/gh/zacanger/md2conf/branch/master/graph/badge.svg)](https://codecov.io/gh/zacanger/md2conf) [![Patreon](https://img.shields.io/badge/patreon-donate-yellow.svg)](https://www.patreon.com/zacanger) [![ko-fi](https://www.ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/U7U2110VB)

## Usage

`npx md2conf < foo.md > foo.conf`, or `npx md2conf foo.md > foo.conf`.

You can install this globally and avoid the extra call to `npx` with `npm i -g
md2conf`.

In Vim, you can rewrite your buffer with `:%! npx md2conf`.

## Patreon Sponsors
This project is sponsored on [Patreon](https://www.patreon.com/zacanger) by:

* [Keeley Hammond](https://github.com/VerteDinde)

[License](./LICENSE.md)
