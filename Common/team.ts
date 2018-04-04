/**
 * Represents a teamate, a tipper belonging to a team
 */
class teamate {
	private readonly tipper: tipper;
	public points: number;

	public name(): string {
		return this.tipper.name;
	}

	public tipped(): number {
		return this.tipper.tipped;
	}

	public constructor(tipper: tipper, points: number = 0) {
		this.tipper = tipper;
		this.points = points;
	}
}

/**
 * Represents a team
 */
class team {
	/** Members of the team */
	protected members: teamate[] = [];

	/** Name of this team */
	public readonly name: string = "";

	/** Emblem applied to members of this teams messages */
	protected readonly emblem: string = "";

	/**
	 * Discount inverted-ratio given to members of this team, off of the tipmenu
	 * 0 is no discount, 0.15 is a 15% discount, etc.
	 */
	protected readonly discount: number = 0;

	/**
	 * Add a user to the team
	 * Because of a lack of data persistance, this is only temporary
	 * @param user User to add
	 */
	public add(user: string, points: number = 0): void {
		let member: teamate = this.lookup(user as string);
		if (member !== null) return; // Already a member, so don't add again
		// See if the user is already a tipper
		let tipper: tipper = tippers.lookup(user as string);
		if (tipper === null) {
			// The user isn't a tipper, so create a dummy entry
			tippers.dummy(user);
			tipper = tippers.lookup(user as string);
		}
		// Add the tipper, and their points, to the team
		this.members[this.members.length] = new teamate(tipper, points);
	}

	/**
	 * Add the users to the team
	 * Because of a lack of data persistance, this is only temporary
	 * @param users Users to add
	 */
	public adds(...users: (string | [string, number])[]): void {
		if (typeof users[0] === "string") {
			for (let user of (users as string[])) {
				this.add(user);
			}
		} else {
			for (let user of (users as [string, number][])) {
				this.add(user[0], user[1]);
			}
		}
	}

	/**
	 * Apply the team emblem to a message if a member
	 * @param message Message to apply emblem
	 */
	public applyEmblem(message: message): string {
		if (this.isMember(message)) {
			return this.emblem + message.m;
		} else {
			return message.m;
		}
	}

	/**
	 * Apply the appropriate discount to the cost if a member
	 * @param item Item to discount
	 * @param user Potentially elligable user
	 */
	public applyDiscount(item: menuitem, user: user | tip | message): number {
		// Is the user a member of this team?
		if (!this.isMember(user)) {
			// Not a member, so don't discount
			return item.cost;
		} else {
			// Calculate the user discount
			return Math.floor(item.cost * (1 - this.discount));
		}
	}

	/**
	 * Delete the user from the team
	 * @param user User to remove
	 */
	public del(user: string): void {
		cbjs.arrayRemove(this.members, this.lookup(user));
	}

	/**
	 * Delete the users from the team
	 * @param user Users to remove
	 */
	public dels(users: string[]): void {
		for (let user of users) {
			cbjs.arrayRemove(this.members, this.lookup(user));
		}
	}

	/**
	 * Is the user a member of this team?
	 * @param user User to check
	 */
	public isMember(user: string | user | message | tip): boolean {
		let name: string;
		if (typeof user == "string") {
			name = user;
		} else {
			name = user.hasOwnProperty("from_user") ? (user as tip).from_user : (user as user).user;
		}
		for (let member of this.members) {
			if (member.name() == name) return true;
		}
		return false;
	}

	/**
	 * The number of members in the team
	 */
	public length(): number {
		return this.members.length;
	}

	/**
	 * List the users in this team
	 */
	public list(withPoints: boolean = false): string[] {
		this.sort();
		let result: string[] = [];
		if (withPoints) {
			let points: number;
			for (let member of this.members) {
				points = member.points + member.tipped();
				result[result.length] = "[" + points + "] " + member.name();
			}
		} else {
			for (let member of this.members) {
				result[result.length] = member.name();
			}
		}
		return result;
	}

	/**
	 * Load the state string into the team
	 * This is used to implement a sort of data persistance, although it must be managed by the user
	 * @param state State string of the team
	 */
	public load(state: string): void {
		let users: string[] = state.trim().split(",");
		let name: string;
		let points: number;
		for (let user of users) {
			name = user.trim().split(" ")[0];
			points = Number(user.trim().split(" ")[1]);
			this.add(name, points);
		}
	}

	/**
	 * Lookup the specified user
	 * @param name Name to lookup
	 */
	public lookup(name: string): teamate {
		for (let member of this.members) {
			if (member.name() == name) {
				return member;
			}
		}
		return null;
	}

	/**
	 * Save the state string for the team
	 * This is used to implement a sort of data persistance, although it must be managed by the user
	 */
	public save(): string {
		this.sort();
		let state: string = "";
		for (let member of this.members) {
			state += member.name() + " " + (member.points + member.tipped()) + ", ";
		}
		state = state.substring(0, state.length - 2); //Removes the trailing comma
		return state;
	}

	/**
	 * Sort the team by points, most first
	 */
	public sort(): void {
		this.members = this.members.sort(
			function (a, b: teamate): number {
				return (b.points + b.tipped()) - (a.points + a.tipped());
			}
		);
	}

	/**
	 * Get the total points of this team
	 */
	public points(): number {
		let result: number;
		for (let member of this.members) {
			result += member.points;
		}
		return result;
	}

	public constructor(name: string, emblem: string, discount: number = 0) {
		this.name = name;
		this.emblem = emblem;
		this.discount = discount;
	}
}

/**
 * Represents a team of fanclub members
 * Used to implement team features for the fanclub far more efficiently
 */
class fanteam extends team {
	/**
	 * Is the user a member of this team?
	 * @param user User to check
	 */
	public isMember(user: user | message | tip): boolean {
		return user.hasOwnProperty("from_user") ? (user as tip).from_user_in_fanclub : (user as user).in_fanclub;
	}
}

/**
 * Represents a team of moderator members
 * Used to implement team features for the moderatores far more efficiently
 */
class modteam extends team {
	public isMember(user: user | message | tip): boolean {
		return user.hasOwnProperty("from_user") ? (user as tip).from_user_is_mod : (user as user).is_mod;
	}
}