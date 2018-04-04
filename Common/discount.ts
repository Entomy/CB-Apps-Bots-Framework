/**
 * Manages and applies discounts
 * This is simple, but efficient
 * More sophisticated discount schemes require either tipmenu tables with appropriate lookups, or collections of teams along with the discount method located there
 * For most situations, this is the best discount system, especially considering how lightweight and easy to manage it is
 */
namespace discount {
	"use strict";

	/**
	 * Fanclub cost rate (inverse of discount rate)
	 * This should be within 0~1
	 */
	export let fanclub: number = 1.0;

	/**
	 * Moderator cost rate (inverse of discount rate)
	 * This should be within 0~1
	 */
	export let moderator: number = 1.0;

	/**
	 * Apply the appropriate discount to the specified item, returning the discounted cost
	 * @param item Item to discount
	 * @param user User information for calculating discount
	 */
	export function apply(item: menuitem, user: user | tip | message): number {
		// CB uses different property names for the same thing on different types; this is confusing
		// These two values are assigned from whatever is approriate, to make the actual code easier to read
		let in_fanclub: boolean = user.hasOwnProperty("from_user_in_fanclub") ? (user as tip).from_user_in_fanclub : (user as user).in_fanclub;
		let is_mod: boolean = user.hasOwnProperty("from_user_is_mod") ? (user as tip).from_user_is_mod : (user as user).is_mod;
		// If user has no applicable discount, don't bother calculating it
		if (!in_fanclub && !is_mod) return item.cost;
		// Calculate the user discount based on whatever discount is appropriate and produces the greatest discount (the lowest item cost)
		if (fanclub <= moderator) {
			if (in_fanclub) return Math.floor(item.cost * fanclub);
			else if (is_mod) return Math.floor(item.cost * moderator);
		} else if (moderator <= fanclub) {
			if (is_mod) return Math.floor(item.cost * moderator);
			else if (in_fanclub) return Math.floor(item.cost * fanclub);
		}
		return item.cost;
	}
}

