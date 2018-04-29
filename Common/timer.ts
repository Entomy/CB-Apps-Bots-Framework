/**
 * Represents a timer
 */
class timer {
	/** Name of the timer */
	public readonly name: string;

	/** Duration of the timer, in seconds */
	private duration: number;

	/** Time remaining of the timer, in seconds */
	public remaining: number;

	/** Delay before the timer starts, in seconds */
	private delay: number;

	/** Function to call when started */
	private readonly onStart: () => void;

	/** Function to call when stopped */
	private readonly onStop: () => void;

	/**
	 * Extend the timer
	 * @param seconds Seconds to extend by
	 */
	public extend(seconds: number): void {
		this.duration += seconds;
		this.remaining += seconds;
		notice.send(emblems.timer + "'" + this.name + "' extended with " + seconds + "sec");
	}

	/**
	 * Is the timer active?
	 * This is true whether the timer is delayed or running
	 * A timer is only inactive when it has stopped
	 */
	public isActive(): boolean {
		return this.delay > 0 || this.remaining > 0;
	}

	/**
	 * Is the timer currently delayed?
	 */
	public isDelayed(): boolean {
		return this.delay > 0;
	}

	/**
	 * Is the timer currently running?
	 */
	public isRunning(): boolean {
		return this.remaining < this.duration && this.remaining > 0;
	}

	/**
	 * Perform one tick of the timer, and call any events necessary
	 */
	public tick(): void {
		// Check event conditions
		if (this.delay === 0 && this.remaining === this.duration) {
			notice.send(emblems.timer + "'" + this.name + "' started with " + this.duration / 60 + "min");
			if (this.onStart != null) this.onStart();
		} else if (this.delay === 0 && this.remaining === 0) {
			notice.send(emblems.timer + "'" + this.name + "' has expired");
			if (this.onStop != null) this.onStop();
		} else if (this.delay === 0 && this.remaining % 60 === 0) {
			notice.send(emblems.timer + "'" + this.name + "' has " + this.remaining / 60 + "min remaining");
		}
		// Time down as necessary
		if (this.delay > 0) {
			this.delay--;
		} else if (this.remaining > 0) {
			this.remaining--;
		}
	}

	/**
	 * Create a new timer
	 * @param name Name of the timer
	 * @param duration Duration of the timer, in seconds
	 * @param delay Delay before the timer starts, in seconds
	 */
	public constructor(name: string, duration: number, delay: number = 0, onStart?: () => void, onStop?: () => void) {
		this.name = name;
		this.duration = duration;
		this.remaining = duration;
		this.delay = delay;
		this.onStart = onStart;
		this.onStop = onStop;
	}
}