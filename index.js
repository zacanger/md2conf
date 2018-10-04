const marked = require('marked')
const _ = require('min-util')
const qs = require('min-qs')

// https://roundcorner.atlassian.net/secure/WikiRendererHelpAction.jspa?section=all
// https://confluence.atlassian.com/display/DOC/Confluence+Wiki+Markup
// http://blogs.atlassian.com/2011/11/why-we-removed-wiki-markup-editor-in-confluence-4/

const MAX_CODE_LINE = 20

// eslint-disable-next-line func-style
function Renderer () {}

const escape = (text = '') =>
  // eslint-disable-next-line no-useless-escape
  text.replace(/\{/g, ' &#123; ').replace(/\}/g, ' &#125; ').replace(/\[/g, '\[').replace(/\]/g, '\]')

const rawRenderer = marked.Renderer
const langArr = 'actionscript3 bash csharp coldfusion cpp css delphi diff erlang groovy java javafx javascript perl php none powershell python ruby scala sql vb html/xml'.split(/\s+/)
const langMap = {
  shell: 'bash',
  html: 'html',
  xml: 'xml'
}

// eslint-disable-next-line no-cond-assign
for (let i = 0, x; x = langArr[i++];) {
  langMap[x] = x
}

_.extend(Renderer.prototype, rawRenderer.prototype, {
  paragraph: (text) => text + '\n\n',
  html: (html) => html,
  heading: (text, level) => 'h' + level + '. ' + text + '\n\n',
  strong: (text) => '*' + escape(text) + '*',
  em: (text) => '_' + escape(text) + '_',
  del: (text) => '-' + escape(text) + '-',
  codespan: (text) => ' *{{' + escape(text) + '}}* ',
  blockquote: (quote) => '{quote}' + escape(quote) + '{quote}',
  br: () => '\n',
  hr: () => '----',
  link: (href, title, text) => {
    const arr = [ href ]
    if (title) {
      arr.push(title)
    }
    if (text) {
      arr.unshift(text)
    }
    return '[' + arr.join('|') + ']'
  },
  list: (body, ordered) => {
    const arr = _.filter(_.trim(body).split('\n'), (line) => line)
    const type = ordered ? '#' : '*'
    return '\n' + _.map(arr, (line) => {
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
  listitem: (body) => escape(body) + '\n',
  image: (href, title, text) => {
    const arr = [ href ]
    if (text) {
      arr.push('alt=' + text)
    }
    return '!' + arr.join('|') + '!'
  },
  table: (header, body) => header + body + '\n',
  tablerow: (content) => content + '\n',
  tablecell: (content, flags) => {
    const type = flags.header ? '||' : '|'
    return type + escape(content)
  },
  code: (code, lang) => {
    // {code:language=java|borderStyle=solid|theme=RDark|linenumbers=true|collapse=true}
    if (lang) {
      lang = lang.toLowerCase()
    }
    lang = langMap[lang] || 'none'

    let param = {
      language: lang,
      borderStyle: 'solid',
      theme: 'RDark', // dark is good
      linenumbers: true,
      collapse: false
    }

    const lineCount = _.split(code, '\n').length
    if (lineCount > MAX_CODE_LINE) {
      // code is too long
      param.collapse = true
    }
    param = qs.stringify(param, '|', '=')
    return '{code:' + param + '}\n' + code + '\n{code}\n\n'
  }
})

const renderer = new Renderer()

const md2conf = (markdown) =>
  marked(markdown, { renderer: renderer })

module.exports = md2conf
