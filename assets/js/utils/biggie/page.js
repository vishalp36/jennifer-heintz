import config from 'config'
import cache from 'cache'
import ajax from 'please-ajax'
import create from 'dom-create-element'
import slug from './slug'
import once from '@utils/func'
import Mustache from 'mustache'

export default (req, view, options, done) => {

  const id = slug(req, options)
  const cn = id.replace('/', '-')
  const page = create({ selector: 'div', id: `page-${cn}`, styles: `page page-${cn}` })
  const projects = window._data.projects
  const data = req.params.id ? projects[req.params.id] : window._data[id]

  view.appendChild(page)

  if ( !cache[id] ) {

    if ( req.params.id ) {

      const blocks = ['image', 'split', 'text', 'video']
      const templates = ['single', ...blocks.map(block => `components/${block}`)]
      const urls = templates.map(tmpl => `${config.BASE}templates/${tmpl}.mst`)

      Promise.all(
        urls.map(url => fetch(url).then(res => res.text()))
      ).then(partials => {
        const tmpl = partials.shift()
        partials.forEach((partial, i) => cache.partials[`${blocks[i]}_block`] = partial)
        return tmpl
      }).then(tmpl => {
        const rendered = Mustache.render(tmpl, data, cache.partials)
        page.innerHTML = rendered
        cache[id] = rendered
        done()
      })

    } else {

      if ( id === 'home' ) {
        for (let project in projects) {
          data.tiles.push({
            'tile' : projects[project]
          })
        }
      }

      fetch(`${config.BASE}templates/${id}.mst`)
        .then(res => res.text())
        .then(data => {
          const rendered = Mustache.render(object.data, data)
          page.innerHTML = rendered
          cache[id] = rendered
          done()
        })
    }

  } else {

    requestAnimationFrame(_ => {
      page.innerHTML = cache[id]
      done()
    })
  }

  return page
}
