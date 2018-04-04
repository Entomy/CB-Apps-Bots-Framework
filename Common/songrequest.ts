/** Represents the type of song request */
enum requesttype {
	dance,
	karaoke,
	play,
}

/**
 * Represents a song request
 */
class songrequest {
	/** User that requested the song */
	public readonly user: string;

	/** Song requested */
	public readonly song: string;

	/** Request type */
	public readonly type: requesttype;

	public constructor(user: string, song: string, type: requesttype = requesttype.play) {
		this.user = user;
		this.song = song;
		this.type = type;
	}
}