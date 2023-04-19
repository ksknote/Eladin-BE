const bcrypt = require('bcrypt');
const { User } = require('./index');

const dummyUsers = [
    {
        userId: 'user1',
        password: bcrypt.hashSync('password1', 10),
        email: 'user1@example.com',
        userName: 'John Doe',
        role: 'user',
        tokens: [{ token: 'token1' }],
    },
    {
        userId: 'admin1',
        password: bcrypt.hashSync('password1', 10),
        email: 'admin1@example.com',
        userName: 'Jane Doe',
        role: 'admin',
        tokens: [{ token: 'token2' }],
    },
];

const insertDummyUsers = async () => {
    try {
        await User.deleteMany({});
        await User.create(dummyUsers);
        console.log('Dummy users inserted successfully');
    } catch (error) {
        console.error(error);
    }
};

module.exports = { insertDummyUsers };
