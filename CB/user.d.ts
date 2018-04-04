/**
 * Represents a user on CB; a viewer or broadcaster
 */
declare class user {
	/** User who entered the room */
	public user: string;
	/** Is the user in the broadcasters fan club? */
	public readonly in_fanclub: boolean;
	/** Does the user have at least 1 token? */
	public readonly has_tokens: boolean;
	/** Is the user a moderator? */
	public readonly is_mod: boolean;
	/** Is the user a "dark blue"? */
	public readonly tipped_recently: boolean;
	/** Is the user a "purple"? */
	public readonly tipped_alot_recently: boolean;
	/** Is the user a "dark purple"? */
	public readonly tipped_tons_recently: boolean;
	/** Gender of the user */
	public readonly gender: gender;
}