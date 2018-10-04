const marked = require('marked')
const _ = require('min-util')
const qs = require('min-qs')
const inlineLexer = marked.inlineLexer

// https://roundcorner.atlassian.net/secure/WikiRendererHelpAction.jspa?section=all
// https://confluence.atlassian.com/display/DOC/Confluence+Wiki+Markup
// http://blogs.atlassian.com/2011/11/why-we-removed-wiki-markup-editor-in-confluence-4/

const MAX_CODE_LINE = 20
const SPACE = ' '

function Renderer () {}

const escape = (text = '') =>
  text.replace(/\{/g, ' &#123; ').replace(/\}/g, ' &#125; ').replace(/\[/g, '\[').replace(/\]/g, '\]')

var rawRenderer = marked.Renderer
var langArr = 'actionscript3 bash csharp coldfusion cpp css delphi diff erlang groovy java javafx javascript perl php none powershell python ruby scala sql vb html/xml'.split(/\s+/)
var langMap = {
  shell: 'bash',
  html: 'html',
  xml: 'xml'
}
for (var i = 0, x; x = langArr[i++];) {
  langMap[x] = x
}

_.extend(Renderer.prototype, rawRenderer.prototype, {
  paragraph: function (text) {
    return text + '\n\n'
  },
  html: function (html) {
    return html
  },
  heading: function (text, level, raw) {
    return 'h' + level + '. ' + text + '\n\n'
  },
  strong: function (text) {
    return '*' + escape(text) + '*'
  },
  em: function (text) {
    return '_' + escape(text) + '_'
  },
  del: function (text) {
    return '-' + escape(text) + '-'
  },
  codespan: function (text) {
    return ' *{{' + escape(text) + '}}* '
  },
  blockquote: function (quote) {
    return '{quote}' + escape(quote) + '{quote}'
  },
  br: function () {
    return '\n'
  },
  hr: function () {
    return '----'
  },
  link: function (href, title, text) {
    var arr = [href]
    if (title) {
      arr.push(title)
    }
    if (text) {
      arr.unshift(text)
    }
    return '[' + arr.join('|') + ']'
  },
  list: function (body, ordered) {
    var type = ordered ? '#' : '*'
    var parsedBody = _.trim(body)
      .replace(/([a-z0-9])([\*\#]){1} {1}/ig, '$1\n$2 ')
      .split('\n')

    var arr = _.filter(parsedBody, function (line) {
      return line
    })
    var type = ordered ? '#' : '*'
    return '\n' + _.map(arr, function (line) {
      var bullet = type
      if (!/^[*#]+ /.test(line)) {
        // When the line starts with '# ' or '* ', it means that it is
        // a nested list. '* * ' should be squashed to '** ' in the
        // case.
        bullet += ' '
      }
      return bullet + line
    }).join('\n') + '\n\n'
  },
  listitem: function (body, ordered) {
    return escape(body) + '\n'
  },
  image: function (href, title, text) {
    var arr = [href]
    if (text) {
      arr.push('alt=' + text)
    }
    return '!' + arr.join('|') + '!'
  },
  table: function (header, body) {
    return header + body + '\n'
  },
  tablerow: function (content, flags) {
    return content + '\n'
  },
  tablecell: function (content, flags) {
    var type = flags.header ? '||' : '|'
    return type + escape(content)
  },
  code: function (code, lang) {
    // {code:language=java|borderStyle=solid|theme=RDark|linenumbers=true|collapse=true}
    if (lang) {
      lang = lang.toLowerCase()
    }
    lang = langMap[lang] || 'none'
    var param = {
      language: lang,
      borderStyle: 'solid',
      theme: 'RDark', // dark is good
      linenumbers: true,
      collapse: false
    }
    var lineCount = _.split(code, '\n').length
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
