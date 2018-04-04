/**
 * Represents a message being sent
 */
declare class message {
	/** The message color */
	public c: string;
	/** The message background color */
	public background: string;
	/** The message text */
	public m: string;
	/** Username of message sender */
	public user: string;
	/** Message font */
	public f: string;
	/** Is the user in the broadcasters fan club? */
	public readonly in_fanclub: boolean;
	/** Does the user have a least 1 token? */
	public readonly has_tokens: boolean;
	/** Is the user a moderator? */
	public readonly is_mod: boolean;
	/** Is the user a "dark blue"? */
	public readonly tipped_recently: boolean;
	/** Is the user a "purple"? */
	public readonly tipped_alot_recently: boolean;
	/** Is the user a "dark purple"? */
	public readonly tipped_tons_recently: boolean;
	/** Gender of the sender */
	public readonly gender: gender;
	/** Is the message spam? */
	public 'X-Spam': boolean;
}