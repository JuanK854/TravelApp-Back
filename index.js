const express = require('express');
const app = express();

app.use(express.json());

app.use('/users', require('./routes/users'));
app.use('/posts', require('./routes/posts'));
app.use('/locations', require('./routes/locations'));
app.use('/comments', require('./routes/comments'));

app.listen(3010, () => {
    console.log('Server running on port 3010');
});