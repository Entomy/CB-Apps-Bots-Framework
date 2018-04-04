/**
 * Provides permissions checking
 * A lot of these are provided by the object anyways, are are implemented for the sake of orthogonality
 * This is solely for permissions purposes, the levels are:
 * broadcaster > trusted user > moderator > fanclub > tipped tons > tipped alot > tipped > has tokens > gray
 */
namespace permissions {
	"use strict";

	/**
	 * List of trusted users; users with elevated permissions
	 */
	let trusted: string[] = [];

	/**
	 * Trust the users
	 * @param users Users to trust
	 */
	export function entrust(...users: string[]): void {
		for (let user of users) {
			trusted[trusted.length] = user;
		}
	}

	/**
	 * Remove trust of the users
	 * @param users Users to detrust
	 */
	export function detrust(...users: string[]): void {
		for (let user of users) {
			trusted = cbjs.arrayRemove(trusted, user);
		}
	}

	/**
	 * Is the user the broadcaster?
	 * @param user User to check
	 */
	export function isBroadcaster(user: user | message): boolean {
		return user.user === cb.room_slug;
	}

	/**
	 * Is the user a trusted user?
	 * @param user User to check
	 */
	export function isTrusted(user: user | message): boolean {
		return cbjs.arrayContains(trusted, user.user);
	}

	/**
	 * Is the user at least a trusted user?
	 * @param user User to check
	 */
	export function isAtLeastTrusted(user: user | message): boolean {
		return isBroadcaster(user) || isTrusted(user);
	}

	/**
	 * Is the user a moderator?
	 * @param user User to check
	 */
	export function isModerator(user: user | message): boolean {
		return user.is_mod;
	}

	/**
	 * Is the user at least a moderator?
	 * @param user User to check
	 */
	export function isAtLeastModerator(user: user | message): boolean {
		return isAtLeastTrusted(user) || isModerator(user);
	}

	/**
	 * Is the user in the fanclub?
	 * @param user User to check
	 */
	export function isInFanclub(user: user | message): boolean {
		return user.in_fanclub;
	}

	/**
	 * Is the user at least in the fanclub?
	 * @param user User to check
	 */
	export function isAtLeastInFanclub(user: user | message): boolean {
		return isAtLeastModerator(user) || isInFanclub(user);
	}

	/**
	 * Has the user tipped tons recently?
	 * @param user User to check
	 */
	export function hasTippedTons(user: user | message): boolean {
		return user.tipped_tons_recently;
	}

	/**
	 * Has the user at least tipped tons recently?
	 * @param user User to check
	 */
	export function hasAtLeastTippedTons(user: user | message): boolean {
		return isAtLeastInFanclub(user) || hasTippedTons(user);
	}

	/**
	 * Has the user tipped alot recently?
	 * @param user User to check
	 */
	export function hasTippedAlot(user: user | message): boolean {
		return user.tipped_alot_recently;
	}

	/**
	 * Has the user at least tipped alot recently?
	 * @param user User to check
	 */
	export function hasAtLeastTippedAlot(user: user | message): boolean {
		return hasAtLeastTippedTons(user) || hasTippedAlot(user);
	}

	/**
	 * Has the user tipped recently?
	 * @param user User to check
	 */
	export function hasTipped(user: user | message): boolean {
		return user.tipped_recently;
	}

	/**
	 * Has the user at least tipped recently?
	 * @param user User to check
	 */
	export function hasAtLeastTipped(user: user | message): boolean {
		return hasAtLeastTippedAlot(user) || hasTipped(user);
	}

	/**
	 * Does the user have tokens?
	 * @param user User to check
	 */
	export function hasTokens(user: user | message): boolean {
		return user.has_tokens;
	}

	/**
	 * Does the user at least have tokens?
	 * @param user User to check
	 */
	export function hasAtLeastTokens(user: user | message): boolean {
		return hasAtLeastTipped(user) || hasTokens(user);
	}

	/**
	 * Prints the help for permissions
	 * @param message Requesting message
	 */
	export function help(message: message): void {
		if (permissions.isAtLeastTrusted(message)) {
			notice.add("/trust,trusted");
		}
		if (permissions.isBroadcaster(message)) {
			notice.add(emblems.blank + "add <User>+ --Entrust the users");
			notice.add(emblems.blank + "del,delete,rem,remove <User>+ --Detrust the users");
		}
		if (permissions.isAtLeastTrusted(message)) {
			notice.add(emblems.blank + "list --List all trusted users");
			notice.post(message.user);
		}
	}

	/**
	 * Try to parse a permissions command, returning true if a valid command is found
	 * @param message Requesting message
	 */
	export function tryParse(message: message): boolean {
		if (permissions.isBroadcaster(message)) {
			let m: string[] = message.m.split(" ");
			if (m.length === 0) return false;
			let command: string = m.shift().toLowerCase();
			switch (command) {
				case "/detrust":
					for (let user of m) {
						detrust(user);
					}
					return true;
				case "/entrust":
					for (let user of m) {
						entrust(user);
					}
					return true;
				case "/trust":
				case "/trusted":
					if (m.length === 0) return false;
					let operation: string = m.shift().toLowerCase();
					switch (operation) {
						case "add":
							for (let user of m) {
								entrust(user);
							}
							return true;
						case "del":
						case "delete":
						case "rem":
						case "remove":
							for (let user of m) {
								detrust(user);
							}
							return true;
						case "help":
							help(message);
							return true;
						case "list":
							notice.send(trusted.join(", "), message.user);
							return true;
						default:
							return false;
					}
			}
		}
		return false;
	}
}

