/**
 * The CB API
 */
declare namespace cb {
	/**
	 * Changes the room subject
	 * @param new_subject The new room subject
	 */
	export function changeRoomSubject(new_subject: string): void;

	/**
	 * Requests that all users reload the panel (the HTML info area below the cam)
	 * The contents of the panel are controlled by cb.onDrawPanel()
	 * This function is only available to apps, not bots.
	 */
	export function drawPanel(): void;

	/**
	 * Hides the cam feed from viewers and shows them a custom message
	 * You can optionally pass in an array of usernames of whom you'd like to be able to view the cam
	 * @param message Message to show users on the locked cam screen
	 * @param allowed_users Users who can still view the cam
	 */
	export function limitCam_start(message: string, allowed_users?: string[]): void;

	/**
	 * Stops the camera from being hidden from viewers, returning the broadcaster to public broadcasting
	 */
	export function limitCam_stop(): void;

	/**
	 * Adds an array of usernames to allow viewing of the cam while it is hidden to others
	 * You can use this before, during, or after you start/stop limiting the cam
	 * @param allowed_users Users who can still view the cam
	 */
	export function limitCam_addUsers(allowed_users: string[]): void;

	/**
	 * Remove an array of usernames to no longer be able to view the cam
	 * @param removed_users User who can no longer view the cam
	 */
	export function limitCam_removeUsers(removed_users: string[]): void;

	/**
	 * Remove all viewers from being able to view the cam
	 */
	export function limitCam_removeAllUsers(): void;

	/**
	 * Check if a particular username is in the list of those allowed to view the cam
	 * @param user Username to check
	 */
	export function limitCam_userHasAccess(user: string): boolean;

	/**
	 * Get an array of the usernames that are allowed to view the cam
	 */
	export function limitCam_allUsersWithAccess(): string[];

	/**
	 * Check if the cam is viewable by those not in the allowed list
	 */
	export function limitCam_isRunning(): boolean;

	/**
	 * Adds a debug message to the chat
	 * These log message are broadcast to the chat room, but you must enable debug mode to see them
	 * @param message Message to log
	 */
	export function log(message: string): void;

	/**
	 * Return the data needed to display the info panel for a user
	 * This function is only available to apps, not bots
	 * @param func A function that creates the data for the info panel
	 */
	export function onDrawPanel(func: (user: user) => {}): void;

	/**
	 * Receive a notification when a registered member enters the room
	 * @param func A function that operates on each enter
	 */
	export function onEnter(func: (user: user) => void): void;

	/**
	 * Receive a notification when a registered member leaves the room
	 * @param func A function that operates on each leave
	 */
	export function onLeave(func: (user: user) => void): void;

	/**
	 * Receive a notification when a message is sent
	 * @param func A function that operates on each message
	 */
	export function onMessage(func: (message: message) => message): void;

	/**
	 * Receive a notification when a tip is sent
	 * @param func A function that operates on each tip
	 */
	export function onTip(func: (tip: tip) => void): void;

	/**
	 * A variable that contains the name of the current room
	 * This is deliberately declared as a constant, as the room name is actually the broadcaster name and should never change
	 */
	export const room_slug: string;

	/**
	 * Send a message to the room
	 * @param message Message to send
	 * @param to_user If given, the message will only be seen by this user
	 * @param background If given, the message will have the specified background color
	 * @param foreground If given, the message will have the specified foreground color
	 * @param weight If given, the message will have the specified font weight
	 * @param to_group If given, regardless of to_user, the message will only be seen by this group
	 */
	export function sendNotice(message: string, to_user?: string, background?: string, foreground?: string, weight?: weight, to_group?: group): void;

	/**
	 * Call func after msecs
	 * @param func Function to call
	 * @param msecs milliseconds to delay
	 */
	export function setTimeout(func: () => any, msecs: number): void;

	/**
	 * When users send a tip, present them with a list of messages to send with their tip
	 * These messages can be received and processed later by cb.onTip()
	 * This function is only available to apps, not bots
	 * @param func A function that operates on each tip
	 */
	export function tipOptions(func: (user: user) => void): void;

}