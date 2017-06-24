import config from 'config'
import utils from 'utils'
import classes from 'dom-classes'
import { on, off } from 'dom-event'
import Default from './default'

class About extends Default {

	constructor(opt) {

		super(opt)

		this.slug = 'about'

		this.target = { x: 0, y: 0 }
		this.ease = { x: 0, y: 0 }

		this.run = this.run.bind(this)
	}

	init(req, done) {

		super.init(req, done)
	}

	ready(done) {

		super.ready()

		!config.infos.isDevice && this.run()

		done()
	}

	run() {
		requestAnimationFrame(this.run)

		const { target, ease, ui } = this
		const { mouse, width, height } = config

		target.x = (mouse.x - width / 2) / width * 12
  	target.y = (mouse.y - height / 2) / height * 12

		ease.x += (target.x - ease.x) * 0.1
		ease.y += (target.y - ease.y) * 0.1

		ui.bio.style.transform = `rotateX(${-ease.y.toFixed(2)}deg) rotateY(${ease.x.toFixed(2)}deg)`
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

		this.page.parentNode.removeChild(this.page)

		done()
	}
}

module.exports = About
