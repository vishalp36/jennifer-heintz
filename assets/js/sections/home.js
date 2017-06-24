import config from 'config'
import utils from 'utils'
import classes from 'dom-classes'
import Default from './default'
import Custom from '../lib/custom'
import { on, off } from 'dom-event'

class Home extends Default {

	constructor(opt) {

		super(opt)

		this.slug = 'home'

		this.backToTop = this.backToTop.bind(this)
		this.onTileClick = this.onTileClick.bind(this)
	}

	init(req, done) {

		super.init(req, done)
	}

	ready(done) {

		super.ready()

		this.createCanvas()

		this.addEvents()

		done()
	}

	addEvents() {

		this.initScroller()

		this.ui.tile.forEach(tile => on(tile, 'click', this.onTileClick))
		on(this.ui.button, 'click', this.backToTop)
	}

	removeEvents() {

		this.scroller.destroy()

		this.ui.tile.forEach(tile => off(tile, 'click', this.onTileClick))
		off(this.ui.button, 'click', this.backToTop)
	}

	createCanvas() {

		this.canvas = document.createElement('canvas')
		this.ctx = this.canvas.getContext('2d')

		this.canvas.width = config.width
		this.canvas.height = config.height

		document.body.appendChild(this.canvas)
	}

	initScroller() {

		this.scroller = new Custom({
			section: this.ui.scrollArea,
			opacity: this.ui.button,
			parallax: this.ui.tile,
			noscrollbar: true,
			ease: 0.1,
			vs: {
				mouseMultiplier: 0.25,
				firefoxMultiplier: 30
			}
		})
	}

	backToTop() {

		this.scroller && this.scroller.scrollTo(0)
	}

	onTileClick(evt) {

		this.scroller.off()

		this.target = evt.currentTarget

		const pageRect = this.page.getBoundingClientRect()
		const rect = this.target.querySelector('.project-tile__gradient').getBoundingClientRect()

		this.c = {
			W: rect.width,
			H: rect.height,
			X: rect.left - pageRect.left,
			Y: rect.top - pageRect.top,
			from: this.target.dataset.bgFrom,
			to: this.target.dataset.bgTo
		}
	}

	animateIn(req, done) {

		classes.add(config.body, `is-${this.slug}`)

		const tl = new TimelineMax({paused: true, onComplete: _ => {
			done()
			this.scroller.init()
			this.lazyLoad()
		}})

		if (req.previous && !req.previous.params.id) {
			tl.fromTo(this.page, 1,
				{ x: req.previous.route === '/about' ? '100%' : '-100%' },
				{ x: '0%' }, 'in')
		} else {
			tl.staggerFromTo(this.ui.tile, 1, {
				y: 100,
				autoAlpha: 0
			}, {
				delay: 0.6,
				y: 0,
				autoAlpha: 1
			}, 0.05)
		}

		tl.restart()
	}

	animateOut(req, done) {
		this.route = req.route

		classes.remove(config.body, `is-${this.slug}`)

		req.params.id ? this.animateToSingle(done) : this.animateToSection(done)
	}

	animateToSingle(done) {

		this.canvas.style['z-index'] = 100

		this.draw(this.c)

		const time = 0.6

		const tl = new TimelineMax({paused: true, onComplete: done})

		tl.to(this.ui.tile, time, { autoAlpha: 0 })
		tl.to(this.c, time, {
			H: config.height,
			Y: 0,
			ease: Expo.easeInOut,
			onUpdate: _ => {
				this.draw(this.c)
			}
		}, '-=0.5')
		tl.to(this.c, time, {
			W: config.width,
			X: 0,
			ease: Expo.easeInOut,
			onUpdate: _ => {
				this.draw(this.c)
			}
		})
		tl.restart()
	}

	animateToSection(done) {

		this.canvas.parentNode.removeChild(this.canvas)

		const tl = new TimelineMax({ paused: true, onComplete: done })

		tl.to(this.page, 1, { x: this.route === '/about' ? '100%' : '-100%' }, 'out')
		tl.restart()
	}

	lazyLoad() {

		[...this.ui.lazy].forEach(el => {

			const img = document.createElement('img')
			const image = el.getAttribute('data-src')

			img.onload = () => {

				el.style['background-image'] = `url('${image}')`

				if (el.nextElementSibling) {
					requestAnimationFrame(_ => classes.add(el.nextElementSibling, 'hidden'))
				}
			}

			img.src = image
		})
	}

	draw(c) {

		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
		const C = this.getGradientLineLength(c.W, c.H)
		const B = Math.sqrt((C * C)/2)
		const translate = Math.abs((c.W - B) / 2)
		const startX = c.W > c.H ? c.X + translate : c.X - translate
		const startY = c.W > c.H ? c.Y - translate : c.Y + translate
		const endX = c.W > c.H ? c.X + c.W - translate : c.X + c.W + translate
		const endY = c.W > c.H ? c.Y + c.H + translate : c.Y + c.H - translate
		const gradient = this.ctx.createLinearGradient(startX, startY, endX, endY)
		gradient.addColorStop(0, c.from)
		gradient.addColorStop(1, c.to)
		this.ctx.fillStyle = gradient
		this.ctx.fillRect(c.X, c.Y, c.W, c.H)
	}

	getGradientLineLength(W, H) {
		return Math.abs(W * Math.sin(45)) + Math.abs(H * Math.cos(45))
	}

	resize(width, height) {

		this.canvas.width = width
		this.canvas.height = height
	}

	destroy(req, done) {

		super.destroy()

		this.removeEvents()

		this.page.parentNode.removeChild(this.page)

		done()
	}
}

module.exports = Home
