/**
 * Manages and records tippers
 */
namespace tippers {
	"use strict";

	/**
	 * All the tippers this show
	 */
	let pool: tipper[] = [];

	/**
	 * Add the tip, incrementing an existing tipper, or adding a new one
	 * @param tip Tip to add
	 */
	export function add(tip: tip): void {
		let candidate: tipper = lookup(tip.from_user);
		if (candidate == null) {
			pool[pool.length] = new tipper(tip.from_user, 0);
			candidate = pool[pool.length - 1];
		}
		candidate.tipped += tip.amount;
	}

	/**
	 * Get the total amount of tippers
	 */
	export function count(): number {
		return pool.length;
	}

	/**
	 * Adds a dummy tipper
	 * This creates an entry in the tippers manager, with no tip amount, which is necessary for teams
	 * This should never, ever, be called outside of initialization
	 * @param name Name of the tipper
	 */
	export function dummy(name: string): void {
		pool[pool.length] = new tipper(name, 0);
	}

	/**
	 * Lookup the user, null if not found
	 * @param user User to look up
	 */
	export function lookup(user: string): tipper {
		for (let tipper of pool) {
			if (tipper.name === user) return tipper;
		}
		return null;
	}

	/**
	 * Return the mean of the lower half
	 */
	export function meanLower(): number {
		sort();
		let lower: tipper[] = pool.slice(0, pool.length);
		let total: number = 0;
		for (let tipper of lower) {
			total += tipper.tipped;
		}
		return total / lower.length;
	}

	/**
	 * Return the mean of the upper half
	 */
	export function meanUpper(): number {
		sort();
		let upper: tipper[] = pool.slice(pool.length / 2, pool.length);
		let total: number = 0;
		for (let tipper of upper) {
			total += tipper.tipped;
		}
		return total / upper.length;
	}

	/**
	 * Return the median tip
	 */
	export function median(): number {
		sort();
		if (pool[Math.floor(pool.length / 2)] == null) {
			return NaN;
		} else {
			return pool[Math.floor(pool.length / 2)].tipped;
		}
	}

	/**
	 * Sort the tippers, highest first
	 */
	export function sort(): void {
		pool = pool.sort(
			function (a, b: tipper): number {
				return b.tipped - a.tipped;
			}
		);
	}

	/**
	 * Return the specified amount of top tippers
	 * This is used to fetch a leaderboard, although it has other uses
	 * @param amount Amount of tippers from the top to get
	 */
	export function top(amount: number): tipper[] {
		sort();
		return pool.slice(0, amount);
	}

	/**
	 * Get the total amount tipped
	 */
	export function tipped(): number {
		let total: number = 0;
		for (let tipper of pool) {
			total += tipper.tipped;
		}
		return total;
	}
}

