import config from 'config'
import utils from 'utils'
import classes from 'dom-classes'
import { on, off } from 'dom-event'
import Default from './default'

class About extends Default {

	constructor(opt) {

		super(opt)

		this.slug = 'about'

		this.page = { x: 0, y: 0 }
		this.ease = { x: 0, y: 0 }

		this.onMouseMove = this.onMouseMove.bind(this)
	}

	init(req, done) {

		super.init(req, done)
	}

	ready(done) {

		super.ready()

		this.addEvents()

		done()
	}

	addEvents() {

		!config.infos.isDevice && on(config.body, 'mousemove', this.onMouseMove)
	}

	removeEvents() {

		!config.infos.isDevice &&  off(config.body, 'mousemove', this.onMouseMove)
	}

	onMouseMove(evt) {

		this.page.x = (evt.pageX - config.width / 2) / config.width * 12
  	this.page.y = (evt.pageY - config.height / 2) / config.height * 12

		this.ease.x += (this.page.x - this.ease.x) * .1
		this.ease.y += (this.page.y - this.ease.y) * .1

		requestAnimationFrame(_ => {
			this.ui.bio.style.transform = `rotateX(${-this.ease.y}deg) rotateY(${this.ease.x}deg)`
		})
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
