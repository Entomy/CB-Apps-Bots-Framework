/**
 * Manages the room subject
 */
namespace subject {
	"use strict";

	/**
	 * Whatever should be displayed when there is no goal or otherwise
	 */
	export let defaultTitle: string;

	/**
	 * Room hashtags to be preserved across title changes
	 */
	export let hashtags: string;

	/**
	 * Revert back to default room title
	 */
	export function revert(): void {
		cb.changeRoomSubject(defaultTitle + " " + hashtags);
	}

	/**
	 * Sets the room title
	 * @param title New room title
	 */
	export function set(title: string): void {
		cb.changeRoomSubject(title + " " + hashtags);
	}
}