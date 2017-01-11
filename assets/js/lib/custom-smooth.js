import Smooth from 'smooth-scrolling'
import clamp from '../utils/math/clamp'

class Custom extends Smooth {

  constructor(opt = {}) {

    super(opt)

    this.dom.section = opt.section
    this.dom.opacity = opt.opacity
    
    this.sectionBottom = this.dom.section.getBoundingClientRect().bottom.toFixed()
    this.opacityBottom = this.dom.opacity.getBoundingClientRect().bottom.toFixed()
  }

  run() {

    super.run()
    
    this.sectionBottom = this.dom.section.getBoundingClientRect().bottom.toFixed()
    
    const current = Math.round(Math.abs(this.opacityBottom - this.sectionBottom))
    const opacity = clamp(0, current / (this.vars.height * .15), 1)
    const inview = (this.opacityBottom - this.sectionBottom) >= 0
    
    this.dom.opacity.style.opacity = inview ? opacity.toFixed(2) : 0
    this.dom.section.style[this.prefix] = this.getTransform(-this.vars.current.toFixed(2))
  }

  resize() {
    
    this.sectionBottom = this.dom.section.getBoundingClientRect().bottom.toFixed()
    this.opacityBottom = this.dom.opacity.getBoundingClientRect().bottom.toFixed()

    this.vars.bounding = this.dom.section.getBoundingClientRect().height - this.vars.height * 0.5

    super.resize()
  }
}

export default Custom