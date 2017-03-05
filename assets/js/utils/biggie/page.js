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
  const route = req.route === '/' ? 'home' : req.route.slice(1)
  const data = req.params.id ? projects[req.params.id] : window._data[route]

  data.tiles = []

  for (let project in projects) {
    data.tiles.push({
      'project' : projects[project]
    })
  }

  data.tiles.forEach(tile => {

    const index = data.tiles.indexOf(tile)
    const next = index === data.tiles.length - 1 ? 0 : index + 1
    const prev = index === 0 ? data.tiles.length -1 : index - 1

    const nextHeroBlock = data.tiles[next].project.content[0]
    const nextHeroImgSrc = nextHeroBlock.image ? nextHeroBlock.image.src : nextHeroBlock.video.still

    const prevHeroBlock = data.tiles[prev].project.content[0]
    const prevHeroImgSrc = prevHeroBlock.image ? prevHeroBlock.image.src : prevHeroBlock.video.still

    tile.project['next'] = {
      title: data.tiles[next].project.title,
      slug: data.tiles[next].project.slug,
      hero: nextHeroImgSrc
    }

    tile.project['prev'] = {
      title: data.tiles[prev].project.title,
      slug: data.tiles[prev].project.slug,
      hero: prevHeroImgSrc
    }
  })

  view.appendChild(page)

  if(!cache[id] || !options.cache) {

    const href = req.params.id ? 'single' : id
    const blockTypes = ['image', 'split', 'text', 'video']
    const partials = {}

    if (req.params.id) {

      blockTypes.forEach(type => {
        ajax.get(`${config.BASE}templates/components/${type}.mst`, {
          success: (object) => {
            partials[`${type}_block`] = object.data
          }
        })
      })
    }

    ajax.get(`${config.BASE}templates/${href}.mst`, {
      success: (object) => {
        const rendered = Mustache.render(object.data, data, partials)
        page.innerHTML = rendered
        if (options.cache) cache[id] = rendered
        done()
      }
    })

  } else {

    requestAnimationFrame(_ => {
      page.innerHTML = cache[id]
      done()
    })
  }

  return page
}
