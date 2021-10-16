class User 
{
	name = null;
	socket = null;

	constructor(socket, name)
	{
		this.name = name;
		this.socket = socket;
	}
}

module.exports = User;