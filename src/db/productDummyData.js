const { Product } = require('./index');

const dummyProducts = [
    {
        productId: 1,
        title: 'Product 1',
        author: 'Author 1',
        price: 20000,
        category: 'Category 1',
        introduction: 'Introduction to product 1',
    },
    {
        productId: 2,
        title: 'Product 2',
        author: 'Author 2',
        price: 35000,
        category: 'Category 2',
        introduction: 'Introduction to product 2',
    },
];

const insertDummyProducts = async () => {
    try {
        await Product.deleteMany({}, { maxTimeMS: 60000 });
        await Product.create(dummyProducts);
        console.log('Dummy products inserted successfully');
    } catch (error) {
        console.log('Error inserting dummy products: ', error);
    }
};

module.exports = { insertDummyProducts };
