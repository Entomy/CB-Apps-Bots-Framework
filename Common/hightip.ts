/**
 * Manages the high tipper
 */
namespace hightip {
	"use strict";

	/**
	 * The actual tipper
	 */
	let slot: tipper;

	/**
	 * Compare the tip against the highest tip, replacing it if greater
	 * This is single tip only, so no tipper lookup should ever occur
	 * @param tip Tip to compare
	 */
	export function compare(tip: tip): void {
		if (slot == null || tip.amount > slot.tipped) {
			slot = new tipper(tip.from_user, tip.amount);
		}
	}

	/**
	 * Print the help menu for hightip
	 * @param message Requesting message
	 */
	export function help(message: message): void {
		notice.add("/hightip --Get the highest single tipper");
		notice.post(message.user);
	}

	/**
	 * Load the state string
	 * @param state State string
	 */
	export function load(state: string): void {
		let tipped: string = state.split(" ")[0];
		let name: string = state.split(" ")[1];
		slot = new tipper(name, Number(tipped));
	}

	/**
	 * Get the name of the high tipper
	 */
	export function name(): string {
		return slot == null ? null : slot.name;
	}

	/**
	 * Get the amount tipped during this show
	 */
	export function tipped(): number {
		return slot == null ? null : slot.tipped;
	}

	/**
	 * Try to parse a valid command, returning true if a valid command is found
	 * @param message Requesting message
	 */
	export function tryParse(message: message): boolean {
		let m: string[] = message.m.split(" ");
		if (m.length === 0) return false;
		let command: string = m.shift().toLowerCase();
		switch (command) {
			case "/hightip":
				notice.send(slot.tipped + " " + slot.name, message.user);
				return true;
			default:
				return false;
		}
	}
}

