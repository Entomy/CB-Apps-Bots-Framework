/**
 * Manages timers
 */
namespace timers {
	"use strict";

	/**
	 * Pool of running timers
	 */
	let pool: timer[] = [];

	/**
	 * Duration of the show, in seconds
	 */
	let showtime: number = 0;

	/**
	 * Add the timer to the pool
	 * @param name Name of the timer
	 * @param duration Duration to run for, in seconds
	 * @param delay Delay before start, in seconds
	 * @param onStart Function to call on start
	 * @param onStop function to call on stop
	 */
	export function add(name: string, duration: number, delay: number = 0, onStart?: () => void, onStop?: () => void, onTick?: () => void): void {
		pool[pool.length] = new timer(name, duration, delay, onStart, onStop, onTick);
		if (delay > 0) {
			notice.send(emblems.timer + "'" + name + "' will start in " + delay + "s");
		}
	}

	/**
	 * Clear the pool of all timers
	 */
	export function clear(): void {
		pool = [];
	}

	/**
	 * Delete the specified timer without properly stopping it
	 * @param name Timer name or position to delete
	 */
	export function del(timer: number | string): void {
		if (typeof timer === "number") {
			notice.send(emblems.timer + "'" + pool[timer].name + "' has been removed");
			pool = cbjs.arrayRemove(pool, pool[timer]);
		} else if (typeof timer === "string") {
			if (cbjs.arrayContains(pool, lookup(timer))) {
				notice.send(emblems.timer + "'" + timer + "' has been removed");
				pool = cbjs.arrayRemove(pool, lookup(timer));
			}
		}
	}

	/**
	 * Extend the timer by duration
	 * @param name Name of the timer
	 * @param duration Duration, in seconds, to extend run for
	 */
	export function extend(name: string, duration: number): void {
		let timer: timer = lookup(name);
		if (timer != null) {
			timer.extend(duration);
		}
	}

	/**
	 * Prints the help menu for timers
	 * @param message Requesting message
	 */
	export function help(message: message): void {
		if (permissions.isAtLeastModerator(message)) {
			notice.add("/timer,timers");
			notice.add(emblems.blank + "add,start <Duration> <Name> --Add and start the timer");
		}
		if (permissions.isAtLeastTrusted(message)) {
			notice.add(emblems.blank + "clr,clear --Clear and stop all timers");
			notice.add(emblems.blank + "del,delete (<Name> | <Position>) --Delete the timer without any stop events");
			notice.add(emblems.blank + "ext,extend <Duration> <Name> --Extend the timer");
		}
		notice.add(emblems.blank + "list,print --List all active timers");
		if (permissions.isAtLeastTrusted(message)) {
			notice.add(emblems.blank + "stop (<Name | <Position>) --Stop the timer next tick");
		}
		notice.post(message.user);
	}

	/**
	 * List all active timers
	 */
	export function list(): timer[] {
		return pool;
	}

	/**
	 * Lookup the timer in the pool, null if not found
	 * @param name Name to lookup
	 */
	export function lookup(name: string): timer {
		for (let timer of pool) {
			if (timer.name.toLowerCase() == name.toLowerCase()) {
				return timer;
			}
		}
		return null;
	}

	/**
	 * Get the current duration of the show
	 * This is formatted time: [hours, minutes, seconds]
	 */
	export function showDuration(): [number, number, number] {
		let hours: number = 0;
		let minutes: number = 0;
		let seconds: number = showtime;
		while (seconds >= 3600) {
			seconds -= 3600;
			hours += 1;
		}
		while (seconds >= 60) {
			seconds -= 60;
			minutes += 1;
		}
		return [hours, minutes, seconds];
	}

	/**
	 * Start the timers
	 */
	export function start(): void {
		cb.setTimeout(tick, 1000);
	}

	/**
	 * Set the timer to stop next tick
	 * @param timer Timer to stop
	 */
	export function stop(timer: number | string): void {
		if (typeof timer === "number") {
			if (pool[timer] != null) pool[timer].remaining = 0;
		} else if (typeof timer === "string") {
			let t: timer = lookup(timer);
			if (t != null) {
				t.remaining = 0;
			}
		}
	}

	/**
	 * Count down one interval
	 */
	function tick(): void {
		let keep: timer[] = [];
		showtime += 1;
		for (let timer of pool) {
			if (timer.isActive()) keep[keep.length] = timer;
			timer.tick();
		}
		if (pool !== keep) {
			pool = keep;
		}
		cb.setTimeout(tick, 1000);
	}

	/**
	 * Try to parse a timer command, returning true if a valid command is found
	 * @param message Requesting message
	 */
	export function tryParse(message: message): boolean {
		let m: string[] = message.m.split(" ");
		if (m.length === 0) return false;
		let command: string = m.shift().toLowerCase();
		switch (command) {
			case "/timer":
			case "/timers":
				// Command is valid, break out
				break;
			default:
				return false;
		}
		if (m.length === 0) return false;
		let operation: string = m.shift().toLowerCase();
		let name: string; // This is assigned while parsing operations
		let duration: string; // This is assigned while parsing operations
		let pos: string; // This is assigned while parsing operations
		switch (operation) {
			case "add":
			case "start":
				if (!permissions.isAtLeastModerator(message)) return false;
				duration = m.shift();
				if (isNaN(Number(duration))) {
					// Duration wasn't at the beginning, try finding it at the end
					m.unshift(duration);
					duration = m.pop();
					if (isNaN(Number(duration))) return false; // No duration found, not a valid command
				}
				// We've found the duration, the rest is the name
				name = m.join(" ");
				timers.add(name, Number(duration) * 60);
				return true;
			case "clr":
			case "clear":
				if (!permissions.isAtLeastTrusted(message)) return false;
				timers.clear();
				return true;
			case "del":
			case "delete":
				if (!permissions.isAtLeastTrusted(message)) return false;
				pos = m.shift();
				if (isNaN(Number(pos))) {
					// pos isn't actually a position, so put it back
					m.unshift(pos);
					timers.del(m.join(" "));
				} else {
					timers.del(Number(pos)-1);
				}
				return true;
			case "ext":
			case "extend":
				if (!permissions.isAtLeastTrusted(message)) return false;
				duration = m.shift();
				if (isNaN(Number(duration))) {
					// Duration wasn't at the beginning, try finding it at the end
					m.unshift(duration);
					duration = m.pop();
					if (isNaN(Number(duration))) return false; // No duration found, not a valid command
				}
				// We've found the duration, the rest is the name
				name = m.join(" ");
				timers.extend(name, Number(duration) * 60);
				return true;
			case "help":
				help(message);
				return true;
			case "list":
			case "print":
				let i: number = 0;
				for (let timer of pool) {
					notice.add(++i + ") '" + timer.name + "' with " + timer.remaining + "s");
				}
				notice.apply(emblems.timer);
				notice.post(message.user);
				return true;
			case "stop":
				if (!permissions.isAtLeastTrusted(message)) return false;
				pos = m.shift();
				if (isNaN(Number(pos))) {
					// pos isn't actually a position, so put it back
					m.unshift(pos);
					timers.stop(m.join(" "));
				} else {
					timers.stop(Number(pos)-1);
				}
				return true;
			default:
				return false;
		}
	}

}