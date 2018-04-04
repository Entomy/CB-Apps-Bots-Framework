/**
 * Represents a tipper; a user who as tipped
 */
class tipper {
	/** Name of the tipper */
	public readonly name: string;
	/** Amount tipped during this show */
	public tipped: number;

	public constructor(name: string, tipped: number) {
		this.name = name;
		this.tipped = tipped;
	}
}