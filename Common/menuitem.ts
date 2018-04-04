/**
 * Represents a tipmenu item
 */
class menuitem {

	/** Name of the item */
	public readonly name: string;

	/** Cost of the item */
	public readonly cost: number;

	/** Function to be called when tipped for */
	private readonly handler: (tip: tip, ...params: any[]) => void;

	/** Parameters passed to the handler function */
	private readonly params: any[];

	/**
	 * Handle the item, if it has a handler
	 * This will not call the handler if one is not assigned
	 */
	public handle(tip: tip, params: any[] = this.params): void {
		if (this.handler != null) {
			this.handler(tip, params);
		}
	}

	/**
	 * Create a new menu item
	 * @param name Name of the item
	 * @param cost Cost of the item
	 * @param handler Handler function when this item is tipped for
	 * @param params Parameters for the handler function
	 */
	public constructor(name: string, cost: number, handler?: (tip: tip, ...params: any[]) => void, ...params: any[]) {
		this.name = name;
		this.cost = cost;
		this.handler = handler;
		this.params = params;
	}
}