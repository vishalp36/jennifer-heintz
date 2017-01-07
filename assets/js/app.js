import framework from 'framework'
import config from 'config'
import domselect from 'dom-select'
import query from 'query-dom-components'
import biggie from '@utils/biggie'

class App {
    
  constructor(opt = {}) {
    
    console.log(`%ccode by mike wagz`, 'color: #666')
    
    this.init()
  }
    
  init() {
    
    config.ui = query({ el: config.body })
    
    this.addEvents()
    
    framework.init()
  }

  addEvents() {
    
    biggie.bind.add(config.ui.nav)
  }
}

module.exports = App