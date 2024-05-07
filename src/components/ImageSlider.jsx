import React, { Component } from 'react'
import Slider from 'react-slick'
import SliderArrow from './SliderArrow'

export default class ImageSlider extends Component {
  constructor(props) {
    super(props)
    this.state = {
      nav1: null,
      nav2: null,
    }
    this.sliderRef1 = React.createRef()
    this.sliderRef2 = React.createRef()
  }

  componentDidMount() {
    this.setState({
      nav1: this.sliderRef1.current,
      nav2: this.sliderRef2.current,
    })
  }

  render() {
    const product = this.props.product
    return (
      <>
        <Slider
          className="w-24"
          vertical={true}
          asNavFor={this.state.nav1}
          ref={this.sliderRef2}
          slidesToShow={product.gallery?.length > 5 ? 5 : product.gallery?.length}
          swipeToSlide={true}
          focusOnSelect={true}
          arrows={false}
        >
          {product.gallery?.map((image, index) => (
            <div key={index} className="cursor-pointer">
              <img src={image} alt="product" className="h-24 w-24 object-cover" />
            </div>
          ))}
        </Slider>
        <Slider
          className="relative h-fit w-[600px]"
          asNavFor={this.state.nav2}
          ref={this.sliderRef1}
          nextArrow={<SliderArrow direction="right" />}
          prevArrow={<SliderArrow direction="left" />}
        >
          {product.gallery?.map((image, index) => (
            <div key={index} className="flex cursor-pointer">
              <img src={image} alt="product" className="h-[512px] object-cover" />
            </div>
          ))}
        </Slider>
      </>
    )
  }
}
