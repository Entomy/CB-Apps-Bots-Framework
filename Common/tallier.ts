/** Represents a tally */
type tally = [any, number];

/**
 * Tallies items within the various managers
 */
namespace tallier {
	"use strict";

	/**
	 * The actual tallies
	 */
	let tallies: tally[] = [];

	/**
	 * Add to the tally
	 * @param item Item to add
	 * @param amount Amount to add
	 */
	export function add(item: any, amount: number = 1): void {
		let tally: tally = lookup(item);
		if (tally == null) {
			tallies[tallies.length] = [item, amount];
		} else {
			tally[1] += amount;
		}
	}

	/**
	 * Clear the tallies
	 */
	export function clear(): void {
		tallies = [];
	}

	/**
	 * Calculate the highest tip
	 */
	export function highest(): tally {
		if (tallies == null || tallies === []) return null;
		let high: tally = [null, 0];
		for (let tally of tallies) {
			if (tally[1] > high[1]) high = tally;
		}
		return high;
	}

	/**
	 * Lookup the item, and return its tally, if any, null otherwise
	 * @param item Item to look for
	 */
	export function lookup(item: any): tally {
		for (let tally of tallies) {
			if (tally[0] === item) return tally;
		}
		return null;
	}
}

