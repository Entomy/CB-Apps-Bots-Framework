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
	 */
	public tick(): void {
		if (this.onTick != null) this.onTick();
	}

	/**
	 * Create a new timer
	 * @param name Name of the timer
	 * @param duration Duration of the timer, in seconds
	 * @param delay Delay before the timer starts, in seconds
	 */
	public constructor(name: string, onTick?: () => void) {
		this.name = name;
		this.onTick = onTick;
	}
}