/**
 * Handles tickets
 */
namespace tickets {
	"use strict";

	/**
	 * Cost for a ticket
	 * Tickets aren't sold if this is null
	 */
	export let saleprice: number = null;

	/**
	 * Prints the help for the ticket handler
	 * @param message Requesting message
	 */
	export function help(message: message): void {
		notice.add("/ticket,tickets");
		if (permissions.isAtLeastModerator(message)) {
			notice.add(emblems.blank + "holders --List all ticket holders");
		}
		if (permissions.isAtLeastTrusted(message)) {
			notice.add(emblems.blank + "issue,give <names>+ --Issue a ticket to all specified users");
			notice.add(emblems.blank + "revoke <names>+ --Revoke tickets from all specified users");
			notice.add(emblems.blank + "sale,sell <cost> --Start selling tickets for the specified cost");
			notice.add(emblems.blank + "start show [<message>] --Start the ticket show, with optional message to show non-ticket holders");
			notice.add(emblems.blank + "stop sale,sell --Stop selling tickets");
			notice.add(emblems.blank + "stop show --Stop the ticket show");
		}
	}

	/**
	 * Get all ticket holders
	 */
	export function holders(): string[] {
		return cb.limitCam_allUsersWithAccess();
	}

	/**
	 * Is the user a ticket holder?
	 * @param name Username to check
	 */
	export function is_holder(name: string): boolean {
		return cb.limitCam_userHasAccess(name);
	}

	/**
	 * Issue a ticket to the specified users
	 * @param name Names of the user
	 */
	export function issue(...names: string[]): void {
		cb.limitCam_addUsers(names);
	}

	/**
	 * Revoke the ticket of the specified users
	 * @param name Name of the users
	 */
	export function revoke(...names: string[]): void {
		cb.limitCam_removeUsers(names);
	}

	/**
	 * Revoke all tickets
	 */
	export function revokeAll(): void {
		cb.limitCam_removeAllUsers();
	}

	/**
	 * Start sale of tickets
	 */
	export function startSales(cost: number): void {
		saleprice = cost;
	}

	/**
	 * Start the ticket show
	 * @param message Message to show non-ticket holders
	 */
	export function startShow(message: string = "Buy a ticket into the show for " + saleprice + " tokens"): void {
		cb.limitCam_start(message);
	}

	/**
	 * Stop sale of tickets
	 */
	export function stopSales(): void {
		saleprice = null;
	}

	/**
	 * Stop the ticket show
	 */
	export function stopShow(): void {
		cb.limitCam_stop();
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
			case "/ticket":
			case "/tickets":
				if (!permissions.isAtLeastModerator(message)) return false;
				// Command is valid, break out
				break;
			default:
				return false;
		}
		if (m.length === 0) return false;
		let operation: string = m.shift().toLowerCase();
		switch (operation) {
			case "help":
				help(message);
				return true;
			case "holders":
				notice.send(holders().join(", "), message.user);
				return true;
			case "issue":
			case "give":
				if (!permissions.isAtLeastTrusted(message)) return false;
				for (let user of m) {
					issue(user);
				}
				notice.send("Tickets issued for: " + m, message.user);
				return true;
			case "revoke":
				if (!permissions.isAtLeastTrusted(message)) return false;
				for (let user of m) {
					revoke(user);
				}
				notice.send("Tickets revoked for: " + m, message.user);
				return true;
			case "sale":
			case "sell":
				if (!permissions.isAtLeastTrusted(message)) return false;
				let cost: string = m.shift();
				if (isNaN(Number(cost))) {
					notice.send("'" + cost + "' wasn't recognized as a number", message.user);
					return false;
				}
				startSales(Number(cost));
				notice.send(emblems.notice + "Ticket sales have started for " + saleprice + emblems.token);
				return true;
			case "start":
				if (!permissions.isAtLeastTrusted(message)) return false;
				if (m.length === 0) return false;
				operation = m.shift().toLowerCase();
				switch (operation) {
					case "show":
						if (m.length === 0) {
							startShow();
						} else {
							startShow(m.join(" "));
						}
						return true;
					default:
						return false;
				}
			case "stop":
				if (!permissions.isAtLeastTrusted(message)) return false;
				if (m.length === 0) return false;
				operation = m.shift().toLowerCase();
				switch (operation) {
					case "sale":
					case "sell":
						stopSales();
						notice.send(emblems.notice + "Ticket sales have stopped");
						return true;
					case "show":
						stopShow();
						return true;
					default:
						return false;
				}
			default:
				return false;
		}
	}
}