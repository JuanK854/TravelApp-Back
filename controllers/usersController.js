let users = [{id: 1,email: 'cine.solo@gmail.com',name: 'Pedro Gutierrez',username: 'CineSolo',password: 'hashed_pass_1',profile_picture: 'http://x.com.jpg',bio: 'Un mochilero recien mudado de casa que hace cine en solitario'}];

const getUsers = (req, res) => res.json(users);

const getUserById = (req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (!user) return res.status(404).json({ error: `No existe un usuario con id ${req.params.id}` });
    res.json(user);
};

const createUser = (req, res) => {
    const { email, name, username, password, profile_picture, bio } = req.body;
    if (!email || !name || !username || !password)
        return res.status(400).json({ error: 'email, name, username y password son obligatorios' });

    const nuevo = {
        id: users.length > 0 ? users[users.length - 1].id + 1 : 1,
        email, name, username, password,
        profile_picture: profile_picture || null,
        bio: bio || null
    };
    users.push(nuevo);
    res.status(201).json(nuevo);
};

const updateUser = (req, res) => {
    const index = users.findIndex(u => u.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ error: `No existe un usuario con id ${req.params.id}` });

    const { email, name, username, password, profile_picture, bio } = req.body;
    users[index] = { ...users[index], ...(email && { email }), ...(name && { name }), ...(username && { username }), ...(password && { password }), ...(profile_picture && { profile_picture }), ...(bio && { bio }) };
    res.json({ message: 'Usuario actualizado', user: users[index] });
};

const deleteUser = (req, res) => {
    const index = users.findIndex(u => u.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ error: `No existe un usuario con id ${req.params.id}` });

    const eliminado = users.splice(index, 1);
    res.json({ message: 'Usuario eliminado', user: eliminado[0] });
};

module.exports = { getUsers, getUserById, createUser, updateUser, deleteUser };