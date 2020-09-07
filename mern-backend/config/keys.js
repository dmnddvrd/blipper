const password = process.env.DB_PWD || 'uCERiVKQZP1UGrcJ',
secret = process.env.JWT_SECRET || '123456',
user = process.env.DB_USER || 'dmnd-user';

module.exports = {
    secret,
    mongoURI: `mongodb+srv://${user}:${password}@dmnd-dev.ywdql.mongodb.net/<dbname>?retryWrites=true&w=majority`,
};

