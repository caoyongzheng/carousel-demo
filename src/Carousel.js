import "./Carousel.css";
import React from "react";
import Animation from "./Animation";

export default class Carousel extends React.Component {
  state = {
    offset: 0,
    activeIndex: 0,
    mounted: false
  };
  rootRef = React.createRef();
  componentDidMount() {
    this.setState({ mounted: true });
    window.addEventListener("resize", this.handleResize);
    this.rootRef.current.addEventListener("touchmove", this.handlePointerMove);
    this.startAutoPlay(undefined, 3000);
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize);
    this.rootRef.current.removeEventListener(
      "touchmove",
      this.handlePointerMove
    );
    this.stopAutoPlay();
  }
  handleResize = () => {
    this.stopAutoPlay();
    this.setState(
      {
        offset: this.state.activeIndex * this.width
      },
      () => {
        this.startAutoPlay(undefined, 3000);
      }
    );
  };

  get width() {
    if (!this.rootRef.current) {
      return 0;
    }
    return this.rootRef.current.offsetWidth;
  }

  startAutoPlay = (nextIndex = this.getActiveIndex() + 1, delay = 0) => {
    const { offset } = this.state;
    const nextOffset = nextIndex * this.width;
    this.animation = new Animation({
      duration: Math.abs(nextOffset - offset) / this.width * 600,
      from: offset,
      to: nextOffset,
      delay,
      cb: (v, isEnd) => {
        this.changeOffset(v);
        if (isEnd) {
          this.stopAutoPlay();
          this.startAutoPlay(undefined, 3000);
          this.setState({ activeIndex: this.getActiveIndex() });
        }
      }
    });
  };

  stopAutoPlay = () => {
    if (this.animation) {
      this.animation.pause();
      this.animation = null;
    }
  };

  getActiveIndex = () => {
    if (!this.width) {
      return this.state.activeIndex;
    }
    return Math.floor(this.getSafeOffset(this.state.offset) / this.width);
  };

  handlePointerStart = e => {
    this.stopAutoPlay();
    this.move = true;
    this.startX = e.touches ? e.touches[0].pageX : e.pageX;
    this.startY = e.touches ? e.touches[0].pageY : e.pageY;
    this.offset = this.state.offset;
  };
  handlePointerMove = e => {
    if (!this.move) {
      return;
    }
    const startX = (e.touches ? e.touches[0].pageX : e.pageX) - this.startX;
    const startY = (e.touches ? e.touches[0].pageY : e.pageY) - this.startY;
    if (Math.abs(startX) > Math.abs(startY)) {
      e.preventDefault();
      this.changeOffset(this.offset - startX);
    }
  };
  handlePointerEnd = () => {
    this.move = false;
    this.startAutoPlay(Math.round(this.state.offset / this.width));
  };
  getSafeOffset = offset => {
    let safeOffset = offset;
    const totalWidth = this.props.children.length * this.width;
    if (!totalWidth) {
      return offset;
    }
    while (safeOffset < 0) {
      safeOffset += totalWidth;
    }
    while (safeOffset > totalWidth) {
      safeOffset -= totalWidth;
    }
    return safeOffset;
  };
  changeOffset = offset => {
    if (this.state.mounted) {
      this.setState({ offset: this.getSafeOffset(offset) });
    }
  };
  render() {
    const { children } = this.props;
    const { mounted, offset } = this.state;
    const count = children.length;
    return (
      <div
        className="carousel-container"
        ref={this.rootRef}
        onTouchStart={this.handlePointerStart}
        onTouchEnd={this.handlePointerEnd}
        onMouseDown={this.handlePointerStart}
        onMouseMove={this.handlePointerMove}
        onMouseUp={this.handlePointerEnd}
        onMouseLeave={this.handlePointerEnd}
      >
        {React.Children.map(children, (child, i) => {
          if (!mounted && i > 0) {
            return 0;
          }
          let left = i * this.width - offset;
          if (left < -this.width && mounted) {
            left += count * this.width;
          }
          return React.cloneElement(child, {
            key: i,
            style: Object.assign(
              {
                transform: `translateZ(0px) translateX(${left}px)`,
                WebkitTransform: `translateZ(0px) translateX(${left}px)`
              },
              child.props.style
            )
          });
        })}
      </div>
    );
  }
}
