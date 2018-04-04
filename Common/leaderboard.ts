/**
 * Handles the leaderboard
 */
namespace leaderboard {
	"use strict";

	/**
	 * Number, in minutes, between rotations
	 */
	export let lapse = 10;

	/**
	 * Default size of the leaderboard
	 */
	export let size = 5;

	/**
	 * Prints the help for the leaderboard
	 * @param message Requesting message
	 */
	export function help(message: message): void {
		notice.add("/leaderboard --Print the leaderboard");
		notice.post(message.user);
		message['X-Spam'] = true;
	}

	/**
	 * Is the tipper in the leaderboard position?
	 * This function technically will work beyond the leaderboard, but why would you bother?
	 * @param pos Leaderboard position
	 * @param tipper Tipper to check
	 */
	export function isPos(pos: number, tipper: tipper): boolean {
		return tippers.top(pos)[pos - 1] === tipper;
	}

	/**
	 * Print the leaderboard to chat
	 * @param slots Amount of slots to print
	 * @param sendTo User to send to
	 */
	function print(slots: number = size, sendTo: string = ""): void {
		let top: tipper[] = tippers.top(slots);
		if (top != null && top.length != 0) notice.add("===== Leaderboard =====")
		if (top[0] != null && top[0].tipped != 0) notice.add(emblems.goldmedal + top[0].name + " " + top[0].tipped);
		if (top[1] != null && top[1].tipped != 0) notice.add(emblems.silvermedal + top[1].name + " " + top[1].tipped);
		if (top[2] != null && top[2].tipped != 0) notice.add(emblems.bronzemedal + top[2].name + " " + top[2].tipped);
		if (top[3] != null && top[3].tipped != 0) notice.add(emblems.tinmedal + top[3].name + " " + top[3].tipped);
		if (top[4] != null && top[4].tipped != 0) notice.add(emblems.coppermedal + top[4].name + " " + top[4].tipped);
		notice.post(sendTo);
	}

	/**
	 * Rotate the leaderboard
	 * @param slots Amount of slots to print
	 */
	export function rotate(slots: number = size): void {
		print(slots);
		cb.setTimeout(rotate, lapse * 60 * 1000);
	}

	/**
	 * Try to parse a leaderboard command, returning true if a valid command is found
	 * @param message Requesting message
	 */
	export function tryParse(message: message): boolean {
		let m: string[] = message.m.split(" ");
		if (m.length === 0) return false;
		let command: string = m.shift().toLowerCase();
		switch (command) {
			case "/leaderboard":
				print(size, message.user);
				return true;
			default:
				return false;
		}
	}
}