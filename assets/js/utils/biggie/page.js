import config from 'config'
import cache from 'cache'
import ajax from 'please-ajax'
import create from 'dom-create-element'
import slug from './slug'
import Mustache from 'mustache'

export default (req, view, options, done) => {
    
  const id = slug(req, options)
  const cn = id.replace('/', '-')
  const page = create({ selector: 'div', id: `page-${cn}`, styles: `page page-${cn}` })
  const data = req.params.id ? window._data.projects[req.params.id] : window._data
  
  view.appendChild(page)

  if(!cache[id] || !options.cache) {
      
    ajax.get(`${config.BASE}templates/${id}.mst`, {
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