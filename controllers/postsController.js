let posts = [{id: 1, user_id: 1, title: 'Rodando en CDMX sin plan', description: 'Llege sin saber a donde ir y termine grabando en tepito de pura casualidad. no se si fue mala idea pero salio algo', images: ['http://x.com.jpg'], creation: '2025-04-16 00:00:00'}];

const getPosts = (req, res) => res.json(posts);

const getPostById = (req, res) => {
    const post = posts.find(p => p.id === parseInt(req.params.id));
    if (!post) return res.status(404).json({ error: `No existe un post con id ${req.params.id}` });
    res.json(post);
};

const createPost = (req, res) => {
    const { user_id, title, description } = req.body;
    if (!user_id || !title || !description)
        return res.status(400).json({ error: 'user_id, title y description son obligatorios' });

    const nuevo = { id: posts.length > 0 ? posts[posts.length - 1].id + 1 : 1, ...req.body, creation: new Date().toISOString() };
    posts.push(nuevo);
    res.status(201).json(nuevo);
};

const updatePost = (req, res) => {
    const index = posts.findIndex(p => p.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ error: `No existe un post con id ${req.params.id}` });

    posts[index] = { ...posts[index], ...req.body };
    res.json({ message: 'Post actualizado', post: posts[index] });
};

const deletePost = (req, res) => {
    const index = posts.findIndex(p => p.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ error: `No existe un post con id ${req.params.id}` });

    const eliminado = posts.splice(index, 1);
    res.json({ message: 'Post eliminado', post: eliminado[0] });
};

module.exports = { getPosts, getPostById, createPost, updatePost, deletePost };