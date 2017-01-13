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
		this.run = this.run.bind(this)
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
		
		on(config.body, 'mousemove', this.onMouseMove)
	}
	
	removeEvents() {
		
		off(config.body, 'mousemove', this.onMouseMove)
		
		cancelAnimationFrame(this.run)
	}
	
	onMouseMove(evt) {
		
		this.page.x = (evt.pageX - config.width / 2) / config.width * 6
  	this.page.y = (evt.pageY - config.height / 2) / config.height * 6
		
		requestAnimationFrame(this.run)
	}
	
	run() {
		
		this.ease.x += (this.page.x - this.ease.x) * .05
		this.ease.y += (this.page.y - this.ease.y) * .05
		
		this.ui.bio.style.transform = `rotateX(${this.ease.y}deg) rotateY(${-this.ease.x}deg)`
		
		requestAnimationFrame(this.run)
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
			onComplete: done
		})
	}

	destroy(req, done) {

		super.destroy()
		
		this.removeEvents()

		this.page.parentNode.removeChild(this.page)
		
		done()
	}
}

module.exports = About