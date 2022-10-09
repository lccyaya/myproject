export class PageActive {
  private activeAt: number = Date.now();
  private readonly onInactive: (duration: number) => void;
  constructor(
    onInactive: (duration: number) => void
  ) {
    this.onInactive = onInactive;
    this.registerListener();
  }

  handleActive = () => {
    this.activeAt = Date.now();
  }

  handleInactive = () => {
    const now = Date.now();
    // 改系统时间可能会出现负数，Math.max
    const duration = Math.max(now - this.activeAt, 0);
    this.onInactive(duration);
  }

  handleChange = () => {
    if (document.visibilityState === 'visible') {
      this.handleActive();
    } else {
      this.handleInactive();
    }
  }

  registerListener = () => {
    document.addEventListener('visibilitychange', this.handleChange);
  }
}
