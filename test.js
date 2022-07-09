const md2conf = require('./')
const tape = require('tape')

const pairs = [
  ['# h1', 'h1. h1\n\n'],
  ['head1\n===', 'h1. head1\n\n'],
  ['###  h3', 'h3. h3\n\n'],
  ['- item\n  - nested', '\n* item\n** nested\n\n']
]

tape.test('basic', (t) => {
  pairs.forEach((arr) => {
    t.equal(md2conf(arr[0]), arr[1])
  })
  t.end()
})

tape.test('header 1', (t) => {
  t.equal(md2conf('# Hello'), 'h1. Hello\n\n')
  t.end()
})

tape.test('heading 2', (t) => {
  t.equal(md2conf('## Hello'), 'h2. Hello\n\n')
  t.end()
})

tape.test('heading 3', (t) => {
  t.equal(md2conf('### Hello'), 'h3. Hello\n\n')
  t.end()
})

tape.test('heading 4', (t) => {
  t.equal(md2conf('#### Hello'), 'h4. Hello\n\n')
  t.end()
})

tape.test('unordered list', (t) => {
  t.test('basic', (t) => {
    const list = ''.concat(
      '- this\n',
      '- is\n',
      '- a\n',
      '- list\n'
    )
    const confluenceList = '\n' + list.replace(/-/g, '*') + '\n'
    t.equal(md2conf(list), confluenceList)
    t.end()
  })

  t.test('nested', (t) => {
    const markdownList = ''.concat(
      '- this\n',
      '- is\n',
      '  - nested\n',
      '    - deep nested\n',
      '- a\n',
      '  - nested\n',
      '- list\n'
    )

    const confluenceList = '\n'.concat(
      '* this\n',
      '* is\n',
      '** nested\n',
      '*** deep nested\n',
      '* a\n',
      '** nested\n',
      '* list\n\n'
    )
    t.equal(md2conf(markdownList), confluenceList)
    t.end()
  })
})

// eslint-disable-next-line max-lines-per-function
tape.test('ordered list', (t) => {
  t.test('basic', (t) => {
    const list = ''.concat(
      '1. this\n',
      '1. is\n',
      '1. a\n',
      '1. list\n'
    )

    const confluenceList = '\n' + list.replace(/1\./g, '#') + '\n'
    t.equal(md2conf(list), confluenceList)
    t.end()
  })

  t.test('nested', (t) => {
    const markdownList = ''.concat(
      '1. this\n',
      '1. is\n',
      '  1. nested\n',
      '    1. deep nested\n',
      '1. a\n',
      '  1. nested\n',
      '1. list\n'
    )
    const confluenceList = '\n'.concat(
      '# this\n',
      '# is\n',
      '## nested\n',
      '### deep nested\n',
      '# a\n',
      '## nested\n',
      '# list\n\n'
    )
    t.equal(md2conf(markdownList), confluenceList)
    t.end()
  })

  t.test('nested mixed', (t) => {
    const markdownList = ''.concat(
      '1. this\n',
      '1. is\n',
      '  - nested\n',
      '    - deep nested\n',
      '1. a\n',
      '  - nested\n',
      '1. list\n'
    )
    const confluenceList = '\n'.concat(
      '# this\n',
      '# is\n',
      '#* nested\n',
      '#** deep nested\n',
      '# a\n',
      '#* nested\n',
      '# list\n\n'
    )
    t.equal(md2conf(markdownList), confluenceList)
    t.end()
  })
})

tape.test('strong text', (t) => {
  t.equal(md2conf('**strong**'), '*strong*\n\n')
  t.end()
})

tape.test('italics text', (t) => {
  t.equal(md2conf('*some text here*'), '_some text here_\n\n')
  t.end()
})

tape.test('inline code', (t) => {
  t.equal(md2conf('`hello world`'), ' *{{hello world}}* \n\n')
  t.end()
})

tape.test('block of code', (t) => {
  const code = '    this is code\n'
  t.equal(md2conf(code), '{code:language=none|borderStyle=solid|theme=RDark|linenumbers=true|collapse=false}\nthis is code\n{code}\n\n')
  t.end()
})

tape.test('strikethrough', (t) => {
  t.equal(md2conf('~~strikethrough text~~'), '-strikethrough text-\n\n')
  t.end()
})

tape.test('quote', (t) => {
  t.equal(md2conf('> this is a quote'), '{quote}this is a quote\n\n{quote}')
  t.end()
})

tape.test('hyperlink', (t) => {
  t.equal(md2conf('[](http://github.com)'), '[http://github.com]\n\n')
  t.equal(md2conf('http://github.com'), '[http://github.com|http://github.com]\n\n')
  t.equal(md2conf('[github](http://github.com)'), '[github|http://github.com]\n\n')
  t.equal(md2conf('[](http://github.com "Github")'), '[http://github.com|Github]\n\n')
  t.equal(md2conf('[github](http://github.com "Github")'), '[github|http://github.com|Github]\n\n')
  t.end()
})

tape.test('image link', (t) => {
  t.equal(md2conf('![](http://github.com/logo.png)'), '!http://github.com/logo.png!\n\n')
  t.equal(md2conf('![logo](http://github.com/logo.png)'), '!http://github.com/logo.png|alt=logo!\n\n')
  t.end()
})

tape.test('horizontal rule', (t) => {
  t.equal(md2conf('* * *'), '----')
  t.equal(md2conf('***'), '----')
  t.equal(md2conf('*****'), '----')
  t.equal(md2conf('---------------------------------------'), '----')
  t.end()
})
