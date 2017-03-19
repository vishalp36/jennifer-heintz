import 'whatwg-fetch'
import config from 'config'
import cache from 'cache'
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
      const keys = Object.keys(projects)
      const current = keys.indexOf(req.params.id)
      const prev = current === 0 ? keys.length -1 : current - 1
      const next = current === keys.length - 1 ? 0 : current + 1
      const nextProject = projects[keys[next]]
      const prevProject = projects[keys[prev]]
      const nextHeroBlock = nextProject.content[0]
      const nextHeroImgSrc = nextHeroBlock.image ? nextHeroBlock.image.src : nextHeroBlock.video.still
      const prevHeroBlock = prevProject.content[0]
      const prevHeroImgSrc = prevHeroBlock.image ? prevHeroBlock.image.src : prevHeroBlock.video.still

      data['next'] = {
        title: nextProject.title,
        slug: nextProject.slug,
        hero: nextHeroImgSrc
      }

      data['prev'] = {
        title: prevProject.title,
        slug: prevProject.slug,
        hero: prevHeroImgSrc
      }

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
        .then(tmpl => {
          const rendered = Mustache.render(tmpl, data)
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
