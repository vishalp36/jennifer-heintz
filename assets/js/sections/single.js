import config from 'config'
import utils from 'utils'
import classes from 'dom-classes'
import { on, off } from 'dom-event'
import Default from './default'
import Manager from 'slider-manager'

class Single extends Default {

	constructor(opt) {

		super(opt)

		this.bindEvents()

		this.slug = 'single'

		this.isProjectNavClick = false
	}

	bindEvents() {

		['onSlide', 'onProjectNavClick']
			.forEach(fn => this[fn] = this[fn].bind(this))
	}

	init(req, done) {

		super.init(req, done)
	}

	ready(done) {

		super.ready()

		this.slides = Array.from(this.ui.slides)

		this.initSlides()

		this.ui.projectNavLink.forEach(link => {
			on(link, 'click', this.onProjectNavClick)
		})

		done()
	}

	initSlides() {

		this.slides.forEach(slide => {

			const index = this.slides.indexOf(slide)
			const height = slide.getBoundingClientRect().height

			slide.style.transform = `translateY(${height * index}px)`
		})

		this.slider = new Manager({
		  length: this.slides.length - 1,
		  callback: this.onSlide
		})

		this.slider.init()
	}

	setNavColor(index) {

		const color = this.slides[index].querySelector('.block').dataset.light === 'true' ? '#F9F9F9' : '#2B2B2B'

		config.nav.forEach(el => {
			el.style.color = color
		})
	}

	onSlide(evt) {

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

		const tl = new TimelineMax({ paused: true,
			onStart: _ => {
				this.setNavColor(index)
			},
			onComplete: _ => {
				setTimeout(_ => {
					this.slider.animating = false
				}, 200)
			}
		})

		tl.staggerTo(this.slides, .9, { cycle: {
			y: (loop) => index === loop ? 0 : loop < index ? -config.height : config.height,
			zIndex: (loop) => index === loop ? 2 : 1
		}, ease: Expo.easeInOut}, 0, 0)

		tl.restart()
	}

	onProjectNavClick(evt) {

		config.isProjectNavClick = true

		this.direction = evt.currentTarget.dataset.direction
	}

	animateIn(req, done) {

		classes.add(config.body, `is-${this.slug}`)

		const canvas = document.querySelector('canvas')
		const tl = new TimelineMax({ paused: true, onComplete: _ => {

			done()

			config.isProjectNavClick = false

			// remove canvas
			req.previous && req.previous.route === '/' && canvas.parentNode.removeChild(canvas)

			// if hero is a video, play it
			const video = this.slides[0].querySelector('video') || null
			video && video.play()
		}})

		// if routing from the home, add delay
			// so gradient can do its thing
			// and then fade out canvas
		if (req.previous && req.previous.route === '/') {

			tl.to(this.page, 0, {
				autoAlpha: 1,
				ease: Expo.easeInOut,
				delay: 1.6
			})
			tl.add(_ => {
				this.setNavColor(0)
			})
			tl.to(canvas, .6, {
				autoAlpha: 0,
				ease: Expo.easeInOut
			})
			tl.restart()

		} else if (config.isProjectNavClick) {

			// if not, just fade in the page
			tl.add(_ => {
				this.setNavColor(0)
			})
			tl.set(this.page, { delay: 1, autoAlpha: 1 })
			tl.restart()
		} else {

			// if not, just fade in the page
			tl.add(_ => {
				this.setNavColor(0)
			})
			tl.to(this.page, 1, { autoAlpha: 1 })
			tl.restart()
		}
	}

	animateOut(req, done) {

		classes.remove(config.body, `is-${this.slug}`)

		const tl = new TimelineMax({ paused: true, onStart: _ => {

			config.nav.forEach(el => {
				el.style.color = '#2B2B2B'
			})

		}, onComplete: done })


		if (req.params.id && config.isProjectNavClick) {

			const img = this.ui[`${this.direction}Project`]

			tl.set(img, {
				zIndex: 20
			})
			tl.to(img, 1, {
				x: 0,
				ease: Expo.easeInOut
			})
			tl.to(this.page, .4, { autoAlpha: 0 })
			tl.restart()

		} else {

			tl.to(this.page, 1, { autoAlpha: 0, ease: Expo.easeInOut })
			tl.restart()
		}
	}

	destroy(req, done) {

		super.destroy()

		this.ui.projectNavLink.forEach(link => {
			off(link, 'click', this.onProjectNavClick)
		})

		this.slider.destroy()

		this.page.parentNode.removeChild(this.page)

		done()
	}
}

module.exports = Single
