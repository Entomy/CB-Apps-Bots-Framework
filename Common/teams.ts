/**
 * Manages teams and team related features
 */
namespace teams {
	let pool: team[] = [];

	/**
	 * Add the team
	 * @param team Team to add
	 */
	export function addTeam(team: team): void {
		pool[pool.length] = team;
	}

	/**
	 * Add the user to the team if the team exists and the user is not already a member
	 * @param user User to add
	 * @param teamName Team name to add to
	 */
	export function addToTeam(user: string | user | message | tip, teamName: string): void {
		let name: string;
		if (typeof user === "string") {
			name = user;
		} else {
			name = user.hasOwnProperty("from_user") ? (user as tip).from_user : (user as user).user;
		}
		let team: team = lookup(teamName);
		if (team == null) return;
		if (!team.isMember(user)) team.add(name);
	}

	/**
	 * Apply the appropriate discount to the cost if a member
	 * @param item Item to discount
	 * @param user Potentially elligable user
	 */
	export function applyDiscount(item: menuitem, user: user | message | tip): number {
		cb.log("applyDiscount()");
		let result: number = Number.MAX_VALUE;
		let discount: number = Number.MAX_VALUE;
		for (var team of pool) {
			discount = team.applyDiscount(item, user);
			cb.log("discount: " + discount);
			if (discount < result) {
				result = discount;
				cb.log("result: " + result);
			}
		}
		return result;
	}

	/**
	 * Apply the team emblem to a message if a member
	 * @param message Message to apply emblem to, if applicable
	 */
	export function applyEmblem(message: message): string {
		let team: team = memberOf(message);
		if (team !== null) {
			return team.applyEmblem(message);
		} else {
			return message.m;
		}
	}

	/**
	 * Print the help menu for teams
	 * @param message Requesting message
	 */
	export function help(message: message): void {
		if (permissions.isAtLeastModerator(message)) {
			notice.add("/team list --List the teams");
			if (permissions.isAtLeastTrusted(message)) {
				notice.add("/team <Team> add <Users>+ --Add the specified users to the team");
				notice.add("/team <Team> del,delete,rem,remove <Users>+ --Remove the specified users from the team");
			}
			notice.add("/team <Team> list --List the members of the specifed team");
		}
		notice.post(message.user);
	}

	/**
	 * Is the user a member of any team?
	 * @param user User to check
	 */
	export function isMember(user: string | user | message | tip): boolean {
		for (var team of pool) {
			if (team.isMember(user)) return true;
		}
		return false;
	}

	/**
	 * Is the user a member of the specified team?
	 * @param user User to look up
	 * @param teamName Team name to look in
	 * @returns true if a member of the specified team, false if not, or false if the team does not exist
	 */
	export function isMemberOf(user: user | message | tip, teamName: string): boolean {
		let team: team = lookup(teamName);
		if (team == null) return false;
		return team.isMember(user);
	}

	/**
	 * Attempt to look up the team by its name
	 * @param teamName Team name to lookup
	 * @returns The team if found, null otherwise
	 */
	export function lookup(teamName: string): team {
		for (var team of pool) {
			if (team.name == teamName) return team;
		}
		return null;
	}

	/**
	 * Get which team the user is a member of
	 * @param user User to check
	 * @returns The team if found, null otherwise
	 */
	export function memberOf(user: user | message | tip): team {
		for (var team of pool) {
			if (team.isMember(user)) return team;
		}
		return null;
	}

	/**
	 * Try to parse a teams command, returning true if a valid command is found
	 * @param message Requesting message
	 */
	export function tryParse(message: message): boolean {
		let m: string[] = message.m.split(" ");
		if (m.length === 0) return false;
		let command: string = m.shift().toLowerCase();
		switch (command) {
			case "/team":
			case "/teams":
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
			case "list":
				for (var p of pool) {
					notice.send(p.name, message.user);
				}
				return true;
			default:
				// The "command" seems to actually be a team name, so put it back, and begin parsing again
				m.push(operation);
				break;
		}
		let teamName: string = m.shift().toLowerCase();
		let team: team = lookup(teamName);
		if (team == null) {
			notice.send("The given team '" + teamName + "' does not seem to exist", message.user);
			return false;
		}
		if (m.length === 0) return false;
		operation = m.shift().toLowerCase();
		switch (operation) {
			case "add":
				for (var user of m) {
					team.adds(user);
				}
				return true;
			case "del":
			case "delete":
			case "rem":
			case "remove":
				for (var user of m) {
					team.del(user);
				}
			case "list":
			case "print":
				for (var teamate of team.list()) {
					notice.send(teamate, message.user);
				}
				return true;
			default:
				return false;
		}
	}
}