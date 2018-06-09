function ease(x) {
  return 1 - Math.pow(1 - x, 2);
}

export default class Animation {
  constructor({
    from = 0,
    to = 1,
    duration = 300,
    cb = () => {},
    timeFunc = ease,
    delay = 0
  }) {
    this.from = from;
    this.to = to;
    this.duration = duration;
    this.cb = cb;
    this.timeFunc = ease;

    this.isPause = false;

    if (delay) {
      setTimeout(this.tick, delay);
    } else {
      this.tick();
    }
  }
  tick = () => {
    if (this.isPause) {
      return;
    }

    if (!this.start) {
      this.start = Date.now();
    }

    const d = Date.now() - this.start;
    if (d >= this.duration) {
      this.callback(this.to, true);
      return;
    }
    const cursor =
      this.timeFunc(d / this.duration) * (this.to - this.from) + this.from;
    this.callback(cursor);
    if (window.requestAnimationFrame) {
      window.requestAnimationFrame(this.tick);
    } else {
      setTimeout(this.tick, 1000 / 60);
    }
  };
  callback = (t, isEnd = false) => {
    if (this.cb) {
      this.cb(t, isEnd);
    }
  };

  pause = () => {
    this.isPause = true;
  };
}
