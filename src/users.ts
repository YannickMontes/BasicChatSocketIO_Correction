class User {
	name: string | null = null;
	socket: any = null;

	constructor(socket: any, name: string) {
		this.name = name;
		this.socket = socket;
	}
}

export default User;