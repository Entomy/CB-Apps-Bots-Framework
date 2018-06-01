/**
 * Represents a ticker
 */
class ticker {
	/** Name of the timer */
	public readonly name: string;

	/** Function to call on each tick */
	private readonly onTick: () => void;

	/**
	 * Perform one tick, calling the event if there is one
	 * This also initializes the ticker, such that it calls itself again every interval
	 */
	public tick(): void {
		cb.log(this.name + ".tick()");
		this.onTick;
		cb.setTimeout(this.tick, 1000);
	}

	/**
	 * Start the ticker
	 */
	public start(): void {
		cb.log(this.name + ".start()");
		this.onTick;
		cb.setTimeout(this.start, 1000);
	}

	/**
	 * Create a new timer
	 * @param name Name of the timer
	 * @param duration Duration of the timer, in seconds
	 * @param delay Delay before the timer starts, in seconds
	 */
	public constructor(name: string, onTick: () => void) {
		cb.log("new ticker(" + name + ")");
		this.name = name;
		cb.log("name: " + this.name);
		this.onTick = onTick;
	}
}