/**
 * Manages rotating notices
 */
namespace rotater {
	"use strict";

	/**
	 * Number, in minutes, between notices
	 */
	export let lapse: number = 3;

	/**
	 * Notices in rotation
	 */
	let pool: string[] = [];

	/**
	 * Index of the notice pool; current position
	 */
	let n: number = 0;

	/**
	 * Add a notice to rotation
	 * @param notice Notice to add
	 */
	export function add(message: string): void {
		pool[pool.length] = message;
		notice.send(emblems.notice + "'" + message + "' has been added to rotation");
	}

	/**
	 * Delete a notice from rotation
	 * @param notice Notice literal or position to delete
	 */
	export function del(message: number | string): void {
		if (typeof message === "string") {
			pool = cbjs.arrayRemove(pool, message);
			notice.send(emblems.notice + "'" + message + "' has been removed from rotation");
		} else if (typeof message === "number") {
			notice.send(emblems.notice + "'" + pool[message - 1] + "' has been removed from rotation");
			pool = cbjs.arrayRemove(pool, pool[message - 1]);
		}
	}

	/**
	 * Print the help menu for rotating notices
	 * @param message Requesting message
	 */
	export function help(message: message): void {
		notice.add("/rotater,rotating,rotation");
		if (permissions.isAtLeastModerator(message)) {
			notice.add(emblems.blank + "add <Message> --Add the notice to rotation");
		}
		if (permissions.isAtLeastTrusted(message)) {
			notice.add(emblems.blank + "del,delete (<Message> | <Position>) --Delete the notice from rotation");
		}
		notice.add(emblems.blank + "list,print --List all notices in rotation");
		notice.post(message.user);
		notice.clear();
	}

	/**
	 * List all notices in rotation
	 */
	export function list(): string[] {
		return pool;
	}

	export function print(user: message | user): void {
		let i: number = 0;
		for (let note of pool) {
			notice.add(++i + ") " + note);
		}
		notice.post(user.user);
		notice.clear();
	}

	/**
	 * Rotate and post notice
	 */
	function rotate(): void {
		notice.send(emblems.notice + pool[n++]);
		n %= pool.length;
		cb.setTimeout(rotate, lapse * 60 * 1000);
	}

	/**
	 * Start the rotater
	 */
	export function start(): void {
		cb.setTimeout(rotate, lapse * 60 * 1000);
	}

	/**
	 * Try to parse a rotater command, returning true if a valid command is found
	 * @param message Requesting message
	 */
	export function tryParse(message: message): boolean {
		let m: string[] = message.m.split(" ");
		if (m.length === 0) return false;
		let command: string = m.shift().toLowerCase();
		switch (command) {
			case "/rotater":
			case "/rotating":
			case "/rotation":
				// Command is valid, break out
				break;
			default:
				return false;
		}
		if (m.length === 0) return false;
		let operation: string = m.shift().toLowerCase();
		switch (operation) {
			case "add":
				if (permissions.isAtLeastModerator(message)) {
					rotater.add(m.join(" "));
					return true;
				}
				return false;
			case "del":
			case "delete":
				if (permissions.isAtLeastTrusted(message)) {
					let pos: string = m.shift();
					if (isNaN(Number(pos))) {
						// pos isn't actually a position, so put it back
						m.unshift(pos);
						rotater.del(m.join(" "));
					} else {
						rotater.del(Number(pos));
					}
					return true;
				}
				return false;
			case "help":
				help(message);
				return true;
			case "list":
			case "print":
				print(message);
				return true;
			default:
				return false;
		}
	}
}

