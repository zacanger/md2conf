const marked = require('marked')
const qs = require('querystring')

const MAX_CODE_LINE = 20
const rawRenderer = marked.Renderer

const escape = (text = '') =>
  // eslint-disable-next-line no-useless-escape
  text.replace(/\{/g, ' &#123; ').replace(/\}/g, ' &#125; ').replace(/\[/g, '\[').replace(/\]/g, '\]')

const langs = 'actionscript3 bash csharp coldfusion cpp css delphi diff erlang groovy java javafx javascript perl php none powershell python ruby scala sql vb html/xml'.split(/\s+/)
const langMap = {
  shell: 'bash',
  html: 'html',
  xml: 'xml'
}

// eslint-disable-next-line no-cond-assign
for (let i = 0, x; x = langs[i++];) {
  langMap[x] = x
}

// eslint-disable-next-line func-style
function Renderer () {}

Object.assign(Renderer.prototype, rawRenderer.prototype, {
  paragraph: (text) => `${text}\n\n`,
  html: (html) => html,
  heading: (text, level) => `h${level}. ${text}\n\n`,
  strong: (text) => `*${escape(text)}*`,
  em: (text) => `_${escape(text)}_`,
  del: (text) => `-${escape(text)}-`,
  codespan: (text) => ` *{{${escape(text)}}}* `,
  blockquote: (quote) => `{quote}${escape(quote)}{quote}`,
  br: () => '\n',
  hr: () => '----',
  link: (href, title, text) => {
    const xs = [ href ]
    if (title) {
      xs.push(title)
    }
    if (text) {
      xs.unshift(text)
    }
    return `[${xs.join('|')}]`
  },
  list: (body, ordered) => {
    const xs = body.trim().split('\n').filter((a) => a)
    const type = ordered ? '#' : '*'
    return '\n' + xs.map((line) => {
      let bullet = type
      if (!/^[*#]+ /.test(line)) {
        // When the line starts with '# ' or '* ', it means that it is
        // a nested list. '* * ' should be squashed to '** ' in the
        // case.
        bullet += ' '
      }
      return bullet + line
    }).join('\n') + '\n\n'
  },
  listitem: (body) => `${escape(body)}\n`,
  image: (href, title, text) => {
    const xs = [ href ]
    if (text) {
      xs.push(`alt=${text}`)
    }
    return `!${xs.join('|')}!`
  },
  table: (header, body) => `${header}${body}\n`,
  tablerow: (content) => `${content}\n`,
  tablecell: (content, flags) => `${(flags.header ? '||' : '|')}${escape(content)}`,
  code: (code, lang) => {
    // {code:language=java|borderStyle=solid|theme=RDark|linenumbers=true|collapse=true}
    if (lang) {
      lang = lang.toLowerCase()
    }
    lang = langMap[lang] || 'none'

    const params = {
      language: lang,
      borderStyle: 'solid',
      theme: 'RDark',
      linenumbers: true,
      collapse: false
    }

    const lineCount = code.split('\n').length
    if (lineCount > MAX_CODE_LINE) { // code is too long
      params.collapse = true
    }
    const config = qs.stringify(params, '|', '=')
    return `{code:${config}}\n${code}\n{code}\n\n`
  }
})

module.exports = (s = '') =>
  marked(s, { renderer: new Renderer() })
