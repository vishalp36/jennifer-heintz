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
  const array = []
  
  for (let project in projects) {
    array.push({
      'project' : projects[project]
    })
  }
  
  data.tiles = array
  
  view.appendChild(page)

  if(!cache[id] || !options.cache) {
        
    const href = req.params.id ? 'single' : !req.params.id && id.substring(0,4) === 'work' ? 'work' : id
      
    ajax.get(`${config.BASE}templates/${href}.mst`, {
      success: (object) => {
        const rendered = Mustache.render(object.data, data)
        page.innerHTML = rendered
        if (options.cache) cache[id] = rendered
        done()
      }
    })

  } else {
      
    setTimeout(() => {
      page.innerHTML = cache[id]
      done()
    }, 1)
  }

  return page
}