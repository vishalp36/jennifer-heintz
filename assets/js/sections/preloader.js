import config from 'config'
import ajax from 'please-ajax'
import sniffer from 'sniffer'
import classes from 'dom-classes'
import create from 'dom-create-element'
import gsap from 'gsap'

TweenLite.defaultEase = Expo.easeInOut

class Preloader {

	constructor(onComplete) {

		this.preloaded = onComplete
		this.view = config.view
		this.el = null
	}

	init(req, done) {

		classes.add(config.body, 'is-loading')

		ajax.get(`${config.BASE}data/data.json`, {
	 		success: (object) => {
				window._data = object.data
				done()
	 		}
 		})

		config.infos = sniffer.getInfos()

		this.createDOM()

		done()
	}

	createDOM() {

		const page = this.view.firstChild

		this.el = create({
			selector: 'div',
			styles: 'preloader',
			html: `
			<div class="preloader__inner">
				<div class="vertical-align">
					<div class="preloader__text vertical-align__item">
						<h1 class="preloader__name">Jennifer Heintz</h1>
						<h2 class="preloader__subtitle">Designer & Illustrator</h2>
					</div>
				</div>
				<div class="preloader__border preloader__border--top preloader__border--horizontal js-top"></div>
				<div class="preloader__border preloader__border--right preloader__border--vertical js-right"></div>
				<div class="preloader__border preloader__border--bottom preloader__border--horizontal js-bottom"></div>
				<div class="preloader__border preloader__border--left preloader__border--vertical js-left"></div>
			</div>
			`
		})

		this.view.insertBefore(this.el, page)
	}

	resize(width, height) {

		config.width = width
		config.height = height
	}

	animateIn(req, done) {

		const preloaderBorders = document.querySelectorAll('.preloader__border')
		const appBorder = document.querySelector('.js-border')
		const text = document.querySelector('.preloader__text')

		const tl = new TimelineMax({ paused: true, onComplete: () => {
			done()
			this.preloaded()
		}})

		tl.to(text, 1.75, {autoAlpha: 1, ease: Linear.easeNone}, 'start')
		tl.staggerTo(preloaderBorders, .4, {
			cycle: {
				transform: (i) => i === 0 || i === 2 ? 'scaleX(1)' : 'scaleY(1)'
			}
		}, 0.3, 'start')
		tl.set(appBorder, { opacity: 1 })
		tl.restart()
	}

	animateOut(req, done) {

		const text = document.querySelector('.preloader__text')
		const ui = document.querySelectorAll('.js-nav')

		const tl = new TimelineMax({ paused: true, onComplete: done })

		tl.staggerTo(text.children, 1, { autoAlpha: 0 }, 0.05, 'out')
		tl.set(this.el, { autoAlpha: 0 })
		tl.to(ui, 1.5, { autoAlpha: 1 }, 'out')
		tl.restart()
	}

	destroy(req, done) {

		classes.add(config.body, 'is-loaded')
		classes.remove(config.body, 'is-loading')

		this.view.removeChild(this.el)

		done()
	}
}

module.exports = Preloader
