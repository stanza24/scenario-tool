type Callback = (...props: any[]) => any;

/**
 * Умный таймер.
 *
 * @description Умный таймер используется, когда нужна возможность приостановить и возобновить регулярное выполнение функции
 */
export class SmartTimer {
  private callbackStartTime: number;
  private remaining: number = 0;
  private paused: boolean = false;
  private timerId: NodeJS.Timeout;
  private readonly _callback: Callback;
  private _delay: number | null;

  /**
   * Создание таймера
   * @param callback Вызываемый колбек
   * @param delay Дилей между вызовом колбека
   */
  constructor(callback: Callback, delay = null) {
    this._callback = callback;
    this._delay = delay;
    this.start();
  }

  public changeDelay(delay: number | null) {
    this._delay = delay;

    if (delay) {
      // TODO Подумать насчет того чтобы иммедиатли вызвать тут последний колбек
      this.start();
    } else {
      this.stop();
    }
  }

  private execute() {
    this.callbackStartTime = new Date().getTime();
    this._callback();
  }

  public start() {
    if (!this._delay) return;

    this.stop();
    this.paused = false;
    this.timerId = setInterval(() => {
      this.execute();
    }, this._delay);
  }

  public pause(): void {
    if (!this.paused) {
      this.stop();
      this.remaining =
        this.callbackStartTime + (this._delay || 0) - new Date().getTime();
      this.paused = true;
    }
  }

  public resume() {
    if (this.paused) {
      if (this.remaining) {
        setTimeout(() => {
          this.execute();
          this.start();
          this.paused = false;
        }, this.remaining);
      } else {
        this.start();
        this.paused = false;
      }
    }
  }

  public stop() {
    clearInterval(this.timerId);
  }
}
