import "./Carousel.css";
import React from "react";

export default class CarouselFrame extends React.Component {
  render() {
    const { style, children } = this.props;
    return (
      <div className="carousel-frame" style={style}>
        {children}
      </div>
    );
  }
}
