let locations = [{id: 1, post_id: 1, city: 'Ciudad de Mexico', country: 'Mexico'}];

const getLocations = (req, res) => res.json(locations);

const getLocationById = (req, res) => {
    const loc = locations.find(l => l.id === parseInt(req.params.id));
    if (!loc) return res.status(404).json({ error: `No existe una location con id ${req.params.id}` });
    res.json(loc);
};

const createLocation = (req, res) => {
    const { post_id } = req.body;
    if (!post_id) return res.status(400).json({ error: 'post_id es obligatorio' });

    const nuevo = { id: locations.length > 0 ? locations[locations.length - 1].id + 1 : 1, ...req.body };
    locations.push(nuevo);
    res.status(201).json(nuevo);
};

const updateLocation = (req, res) => {
    const index = locations.findIndex(l => l.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ error: `No existe una location con id ${req.params.id}` });

    locations[index] = { ...locations[index], ...req.body };
    res.json({ message: 'Location actualizada', location: locations[index] });
};

const deleteLocation = (req, res) => {
    const index = locations.findIndex(l => l.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ error: `No existe una location con id ${req.params.id}` });

    const eliminado = locations.splice(index, 1);
    res.json({ message: 'Location eliminada', location: eliminado[0] });
};

module.exports = { getLocations, getLocationById, createLocation, updateLocation, deleteLocation };