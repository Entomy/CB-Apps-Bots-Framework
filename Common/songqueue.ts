/**
 * Manages song requests
 */
namespace songqueue {
	"use strict";

	/**
	 * Whether the queue postings should be public
	 */
	let publicPostings: boolean = false;

	/**
	 * The actual queue of song requests
	 */
	let queue: songrequest[] = [];

	/**
	 * Add the song to the queue
	 * @param user Who tipped for the request
	 * @param song Song requested
	 */
	export function add(user: string, song: string, type: requesttype = requesttype.play): void {
		queue[queue.length] = new songrequest(user, song, type);
		switch (type) {
			case requesttype.dance:
				if (publicPostings) {
					notice.send(emblems.song + "Dance: '" + song + "' queued", cb.room_slug);
				} else {
					notice.send(emblems.song + "Dance: '" + song + "' queued");
				}
				break;
			case requesttype.karaoke:
				if (publicPostings) {
					notice.send(emblems.song + "Karaoke: '" + song + "' queued", cb.room_slug);
				} else {
					notice.send(emblems.song + "Karaoke: '" + song + "' queued");
				}
				break;
			case requesttype.play:
				if (publicPostings) {
					notice.send(emblems.song + "Song: '" + song + "' queued", cb.room_slug);
				} else {
					notice.send(emblems.song + "Song: '" + song + "' queued");
				}
				break;
		}
	}

	/**
	 * Get the next song from the queue
	 * Returns null if no more songs
	 */
	export function get(): songrequest {
		if (queue.length === 0) return null;
		else return queue.shift();
	}

	/**
	 * Print the help menu for the song queue
	 * @param message Requesting message
	 */
	export function help(message: message) {
		if (permissions.isBroadcaster(message)) {
			notice.add("/song");
			notice.add(emblems.blank + "next --Get the next song from the queue");
			notice.post(message.user);
			notice.clear();
		}
	}

	/**
	 * Try to parse a song command, returning true if a valid command is found
	 * @param message Requesting message
	 */
	export function tryParse(message: message): boolean {
		let m: string[] = message.m.split(" ");
		if (m.length === 0) return false;
		let command: string = m.shift().toLowerCase();
		switch (command) {
			case "/song":
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
			case "next":
				if (permissions.isBroadcaster(message)) {
					let request: songrequest = get();
					if (request == null) {
						notice.send(emblems.song + "No songs in queue");
					} else {
						switch (request.type) {
							case requesttype.dance:
								notice.send(emblems.song + request.user + ":Dance: " + request.song);
								break;
							case requesttype.karaoke:
								notice.send(emblems.song + request.user + ":Karaoke: " + request.song);
								break;
							case requesttype.play:
								notice.send(emblems.song + request.user + ":Play: " + request.song);
								break;
						}
					}
					return true;
				}
				return false;
			default:
				return false;
		}
	}
}

