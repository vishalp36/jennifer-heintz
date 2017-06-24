import framework from 'framework'
import config from 'config'
import query from 'query-dom-components'
import biggie from '@utils/biggie'
import { on, off } from 'dom-event'

class App {

  constructor(opt = {}) {

    console.log(`%ccode by mike wagz`, 'color: #666')

    this.ui = {
      pupil: document.querySelector('#pupil'),
      ball: document.querySelector('#ball'),
      iris: document.querySelector('#iris')
    }

    this.pupil = this.ui.pupil.getBoundingClientRect()
    this.eye = this.ui.ball.getBoundingClientRect()
    this.iris = this.ui.iris.getBoundingClientRect()
    this.mouse = { x: 0, y: 0 }
    this.translate = { x: 0, y: 0 }
    this.ease = { x: 0, y: 0 }

    this.onMove = this.onMove.bind(this)
    this.run = this.run.bind(this)

    this.init()
  }

  init() {

    config.ui = query({ el: config.body })

    framework.init()

    this.addEvents()

    this.run()
  }

  addEvents() {

    biggie.bind.add(config.ui.nav)

    on(document, 'mousemove', this.onMove)
  }

  onMove({ pageX: x, pageY: y }) {
    this.mouse.x = x
    this.mouse.y = y
  }

  run() {
    requestAnimationFrame(this.run)

    const { translate, mouse, ease, pupil, eye, ui } = this
    const { width, height } = config

    translate.x = ((mouse.x - (pupil.left + pupil.width / 2)) / width) * eye.width
    translate.y = ((mouse.y - (pupil.top + pupil.height / 2)) / height) * eye.height

    ease.x += (translate.x - ease.x) * 0.25
    ease.y += (translate.y - ease.y) * 0.25

    ui.pupil.style.transform = `translate(${ease.x * 1.6}px, ${ease.y * 1.4}px)`
    ui.iris.style.transform = `translate(${ease.x * 1}px, ${ease.y * 0.8}px)`
  }
}

module.exports = App
