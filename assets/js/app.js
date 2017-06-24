import framework from 'framework'
import config from 'config'
import query from 'query-dom-components'
import biggie from '@utils/biggie'
import { on, off } from 'dom-event'

class App {

  constructor(opt = {}) {

    this.ui = {
      pupil: document.querySelector('#pupil'),
      ball: document.querySelector('#ball'),
      iris: document.querySelector('#iris')
    }

    this.pupil = this.ui.pupil.getBoundingClientRect()
    this.eye = this.ui.ball.getBoundingClientRect()
    this.iris = this.ui.iris.getBoundingClientRect()

    this.target = { x: 0, y: 0 }
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
    config.mouse.x = x
    config.mouse.y = y
  }

  run() {
    requestAnimationFrame(this.run)

    const { target, ease, pupil, eye, ui } = this
    const { mouse, width, height } = config

    target.x = ((mouse.x - (pupil.left + pupil.width / 2)) / width) * eye.width
    target.y = ((mouse.y - (pupil.top + pupil.height / 2)) / height) * eye.height

    ease.x += (target.x - ease.x) * 0.25
    ease.y += (target.y - ease.y) * 0.25

    ui.pupil.style.transform = `translate(${ease.x * 1.6}px, ${ease.y * 1.4}px)`
    ui.iris.style.transform = `translate(${ease.x * 1}px, ${ease.y * 0.8}px)`
  }
}

module.exports = App
