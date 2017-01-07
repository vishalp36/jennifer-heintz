import config from 'config'
import utils from 'utils'
import classes from 'dom-classes'
import Default from './default'

class Single extends Default {
	
	constructor(opt) {
		
		super(opt)

		this.slug = 'single'
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

		TweenLite.to(this.page, 0.7, {
			autoAlpha: 0,
			ease: Expo.easeInOut,
			clearProps: 'all',
			onComplete: done
		})
	}

	destroy(req, done) {

		super.destroy()

		this.page.parentNode.removeChild(this.page)
		
		done()
	}
}

module.exports = Single