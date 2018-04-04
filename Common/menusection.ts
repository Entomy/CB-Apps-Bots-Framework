/**
 * Represents a tipmenu section
 */
class menusection {

	public readonly name: string;

	/**
	 * The actual items of the section
	 */
	private items: menuitem[] = [];

	/**
	 * Add the item to the section
	 * @param name Name of the item
	 * @param cost Cost of the item
	 * @param active The condition in which the item is active
	 * @param handler Handler for when the item is tipped for
	 * @param params Parameters that should be passed to the handler
	 */
	public add(name: string, cost: number, handler?: (...params: any[]) => void, ...params: any[]): void {
		this.items[this.items.length] = new menuitem(name, cost, handler, params);
	}

	/**
	 * Clear the menu of all items
	 */
	public clear(): void {
		this.items = [];
	}

	/**
	 * Delete the item from the section
	 * @param name Name of the item
	 */
	public del(name: string): void {
		this.items = cbjs.arrayRemove(this.items, this.lookup(name));
	}

	/**
	 * List all items in the section
	 */
	public list(): menuitem[] {
		return this.items;
	}

	/**
	 * Lookup the item
	 * @param name Name of the item to get
	 */
	public lookup(name: string): menuitem {
		for (let item of this.items) {
			if (item.name.toLowerCase() === name.toLowerCase()) {
				return item;
			}
		}
		return null;
	}

	/**
	 * Tries to find a match to this section, returning the menuitem if one is found, null otherwise
	 * @param tip Tip to try to find a match for
	 */
	public match(tip: tip): menuitem {
		let price: number;
		for (let item of this.items) {
			if (tip.amount === price) {
				return item;
			}
		}
		return null;
	}

	/**
	 * Print this section to chat
	 * @param limit The cost limit of items to print out, this is used to show all items below a certain cost
	 * @param discountMethod The way to apply discounts to the items, if null items are not discounted under any condition
	 */
	public print(user: user | message, limit?: number, discountMethod: (menuitem: menuitem, user: message | tip | user) => number = null): void {
		let price: number;
		for (let item of this.items) {
			// Discount the item's price if appropriate
			price = discountMethod != null ? discountMethod(item, user) : item.cost;
			// Skip printing the item if the price is higher than a specified limit
			// It would be possible to break if we could gaurantee the items were ordered by cost, but this isn't possible, so just continue
			if (limit != null && price >= limit) continue;
			notice.add(price + emblems.token + item.name);
		}
		notice.apply(emblems.tipmenu);
		notice.post(user.user);
	}

	public constructor(name: string, ...items: menuitem[]) {
		this.name = name;
		this.items = items;
	}
}

