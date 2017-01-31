import framework from 'framework'
import config from 'config'
import $ from 'dom-select'
import query from 'query-dom-components'
import biggie from '@utils/biggie'
import { on, off } from 'dom-event'

class App {

  constructor(opt = {}) {

    console.log(`%ccode by mike wagz`, 'color: #666')

    this.pupil = $('#pupil').getBoundingClientRect()
    this.eye = $('#ball').getBoundingClientRect()
    this.iris = $('#iris').getBoundingClientRect()
    this.mouse = { x: 0, y: 0 }
    this.translate = { x: 0, y: 0 }
    this.ease = { x: 0, y: 0 }

    this.onMove = this.onMove.bind(this)

    this.init()
  }

  init() {

    config.ui = query({ el: config.body })

    this.addEvents()

    framework.init()
  }

  addEvents() {

    biggie.bind.add(config.ui.nav)

    on(document, 'mousemove', this.onMove)
  }

  onMove(evt) {

    this.mouse.x = evt.pageX - (this.pupil.left + this.pupil.width / 2)
    this.mouse.y = evt.pageY - (this.pupil.top + this.pupil.height / 2)

    const normalizedX = (this.mouse.x / config.width).toFixed(3)
    const normalizedY = (this.mouse.y / config.height).toFixed(3)

    this.translate.x = normalizedX * this.eye.width
    this.translate.y = normalizedY * this.eye.height

    this.ease.x += (this.translate.x - this.ease.x) * 0.1
    this.ease.y += (this.translate.y - this.ease.y) * 0.1

    requestAnimationFrame(_ => {

      $('#pupil').style.transform = `translate(${this.ease.x * 1.6}px, ${this.ease.y * 1.4}px)`
      $('#iris').style.transform = `translate(${this.ease.x * 1}px, ${this.ease.y * 0.8}px)`
    })
  }
}

module.exports = App
