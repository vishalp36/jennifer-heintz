import config from 'config'
import utils from 'utils'
import classes from 'dom-classes'
import { on, off } from 'dom-event'
import Default from './default'

class About extends Default {

	constructor(opt) {

		super(opt)

		this.slug = 'about'

		this.mouse = { x: 0, y: 0 }
		this.page = { x: 0, y: 0 }
		this.ease = { x: 0, y: 0 }

		this.onMouseMove = this.onMouseMove.bind(this)
		this.run = this.run.bind(this)
	}

	init(req, done) {

		super.init(req, done)
	}

	ready(done) {

		super.ready()

		this.addEvents()
		this.run()

		done()
	}

	addEvents() {

		!config.infos.isDevice && on(config.body, 'mousemove', this.onMouseMove)
	}

	removeEvents() {

		!config.infos.isDevice && off(config.body, 'mousemove', this.onMouseMove)
	}

	onMouseMove({ pageX: x, pageY: y }) {
		this.mouse.x = x
		this.mouse.y = y
	}

	run() {
		requestAnimationFrame(this.run)

		this.page.x = (this.mouse.x - config.width / 2) / config.width * 12
  	this.page.y = (this.mouse.y - config.height / 2) / config.height * 12

		this.ease.x += (this.page.x - this.ease.x) * 0.1
		this.ease.y += (this.page.y - this.ease.y) * 0.1

		this.ui.bio.style.transform = `rotateX(${-this.ease.y.toFixed(2)}deg) rotateY(${this.ease.x.toFixed(2)}deg)`
	}

	animateIn(req, done) {

		classes.add(config.body, `is-${this.slug}`)

		const tl = new TimelineMax({ paused: true, onComplete: done })

		tl.to(this.page, 1, { autoAlpha: 1, ease: Expo.easeInOut })
		tl.restart()
	}

	animateOut(req, done) {

		classes.remove(config.body, `is-${this.slug}`)

		const tl = new TimelineMax({ paused: true, onComplete: done })

		tl.to(this.page, 1, { autoAlpha: 0, ease: Expo.easeInOut })
		tl.restart()
	}

	destroy(req, done) {

		super.destroy()

		this.removeEvents()

		this.page.parentNode.removeChild(this.page)

		done()
	}
}

module.exports = About
