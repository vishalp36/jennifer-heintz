import config from 'config'
import utils from 'utils'
import classes from 'dom-classes'
import Default from './default'

class Contact extends Default {

	constructor(opt) {

		super(opt)

		this.slug = 'contact'
	}

	init(req, done) {

		super.init(req, done)
	}

	ready(done) {

		super.ready()

		done()
	}

	animateIn(req, done) {

		classes.add(config.body, `is-${this.slug}`)

		TweenLite.to(this.page, 1, {
			autoAlpha: 1,
			ease: Expo.easeInOut,
			onComplete: done
		})
	}

	animateOut(req, done) {

		classes.remove(config.body, `is-${this.slug}`)

		TweenLite.to(this.page, 1, {
			autoAlpha: 0,
			ease: Expo.easeInOut,
			onComplete: done
		})
	}

	destroy(req, done) {

		super.destroy()

		this.page.parentNode.removeChild(this.page)

		done()
	}
}

module.exports = Contact
