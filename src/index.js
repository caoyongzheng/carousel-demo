import React from "react";
import { render } from "react-dom";
import Carousel from "./Carousel";
import CarouselFrame from "./CarouselFrame";

const styles = {
  fontFamily: "sans-serif",
  textAlign: "center"
};

const App = () => (
  <div style={styles}>
    <Carousel>
      <CarouselFrame style={{ backgroundColor: "red" }}>1</CarouselFrame>
      <CarouselFrame style={{ backgroundColor: "green" }}>2</CarouselFrame>
      <CarouselFrame style={{ backgroundColor: "blue" }}>3</CarouselFrame>
    </Carousel>
  </div>
);

render(<App />, document.getElementById("root"));
