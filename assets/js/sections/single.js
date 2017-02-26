import config from 'config'
import utils from 'utils'
import classes from 'dom-classes'
import Default from './default'
import Manager from 'slider-manager'

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

		this.slides = Array.from(this.ui.slides)

		this.initSlides()

		done()
	}

	initSlides() {

		this.setSlides()

		this.slider = new Manager({
		  length: this.slides.length - 1,
		  callback: (evt) => {

	      const index = evt.current
	      const previous = evt.previous
	      const down = evt.direction === 'downwards'

	      this.slider.animating = true

				const currentVideo = this.slides[index].querySelector('video') || null
				const previousVideo = this.slides[previous].querySelector('video') || null

				if (currentVideo) {
					currentVideo.play()
				}

				if (previousVideo) {
					previousVideo.pause()
				}

	      const tl = new TimelineMax({ paused: true, onStart: _ => {
					index === 0 ? this.setNavColor('light') : this.setNavColor()
				}, onComplete: _ => {
	        setTimeout(_ => {
						this.slider.animating = false
					}, 200)
	      }})

	      tl.staggerTo(this.slides, .9, { cycle: {
	        y: (loop) => index === loop ? 0 : loop < index ? -config.height : config.height,
					zIndex: (loop) => index === loop ? 2 : 1
	      }, ease: Power3.easeInOut}, 0, 0)

	      tl.restart()
		  }
		})

		this.slider.init()
	}

	setSlides() {
		const heroBlock = this.slides[0].children[0]

		if (heroBlock.hasAttribute('data-light-ui')) {
			this.setNavColor('light')
		}

		this.slides.forEach(slide => {

			const index = this.slides.indexOf(slide)
			const height = slide.getBoundingClientRect().height

			slide.style.transform = `translateY(${height * index}px)`
		})
	}

	setNavColor(c) {

		const color = c || 'dark'

		config.nav.forEach(el => {
			el.style.color = color === 'light' ? '#F9F9F9' : '#2b2b2b'
		})
	}

	animateIn(req, done) {

		classes.add(config.body, `is-${this.slug}`)
		const canvas = document.querySelector('canvas')
		const tl = new TimelineMax({paused: true, onComplete: _ =>{

			done()

			// remove canvas
			req.previous && req.previous.route === '/' && canvas.parentNode.removeChild(canvas)

			// if hero is a video, play it
			const video = this.slides[0].querySelector('video') || null
			video && video.play()
		}})

		// if routing from the work page, add delay
			// so gradient can do its thing
			// and then fade out canvas
		if (req.previous && req.previous.route === '/') {
			tl.to(this.page, 0, {
				autoAlpha: 1,
				ease: Expo.easeInOut,
				delay: 1.6
			})
			tl.to(canvas, .6, {
				autoAlpha: 0,
				ease: Expo.easeInOut
			})
			tl.restart()
		} else {
			// if not, just fade in the page
			tl.to(this.page, .6, {
				autoAlpha: 1,
				ease: Expo.easeInOut
			})
			tl.restart()
		}

	}

	animateOut(req, done) {

		classes.remove(config.body, `is-${this.slug}`)

		TweenLite.to(this.page, 1, {
			autoAlpha: 0,
			ease: Expo.easeInOut,
			clearProps: 'all',
			onComplete: _ => {
				done()
				this.setNavColor()
		}})
	}

	destroy(req, done) {

		super.destroy()

		this.slider.destroy()

		this.page.parentNode.removeChild(this.page)

		done()
	}
}

module.exports = Single
