const axios = require('axios');
const bcrypt = require('bcrypt');
const { Order, Product, User } = require('./models/index');

const dummyOrders = [
    {
        userId: '613fd5fb5c15a81711e95c13',
        items: [
            { productId: '60b5ead6f502a40022b26d0b', quantity: 2, price: 3000 },
            { productId: '60b5ead6f502a40022b26d0c', quantity: 3, price: 4000 },
        ],
        orderInfo: {
            orderNumber: '20230001',
            totalPrice: 19000,
        },
        deliveryInfo: {
            receiverName: 'Alice Kim',
            receiverPhone: '010-1234-5678',
            address: '1234 Example St',
            postCode: '12345',
        },
        deliveryStatus: 'processing',
    },
    {
        userId: '613fd5fb5c15a81711e95c14',
        items: [
            { productId: '60b5ead6f502a40022b26d0d', quantity: 1, price: 3000 },
            { productId: '60b5ead6f502a40022b26d0e', quantity: 4, price: 4000 },
        ],
        orderInfo: {
            orderNumber: '20230002',
            totalPrice: 19000,
        },
        deliveryInfo: {
            receiverName: 'Bob Lee',
            receiverPhone: '010-2345-6789',
            address: '5678 Example St',
            postCode: '23456',
        },
        deliveryStatus: 'delivered',
    },
    {
        userId: '613fd5fb5c15a81711e95c15',
        items: [
            { productId: '60b5ead6f502a40022b26d0f', quantity: 3, price: 5000 },
            { productId: '60b5ead6f502a40022b26d10', quantity: 2, price: 6000 },
        ],
        orderInfo: {
            orderNumber: '20230003',
            totalPrice: 27000,
        },
        deliveryInfo: {
            receiverName: 'Charlie Park',
            receiverPhone: '010-3456-7890',
            address: '9012 Example St',
            postCode: '34567',
        },
        deliveryStatus: 'processing',
    },
    {
        userId: '613fd5fb5c15a81711e95c16',
        items: [
            { productId: '60b5ead6f502a40022b26d11', quantity: 1, price: 7000 },
            { productId: '60b5ead6f502a40022b26d12', quantity: 2, price: 8000 },
        ],
        orderInfo: {
            orderNumber: '20230004',
            totalPrice: 23000,
        },
        deliveryInfo: {
            receiverName: 'David Kim',
            receiverPhone: '010-4567-8901',
            address: '2345 Example St',
            postCode: '45678',
        },
        deliveryStatus: 'delivered',
    },
];

const insertDummyOrders = async () => {
    try {
        await Order.deleteMany({}, { maxTimeMS: 60000 });
        await Order.create(dummyOrders);
        console.log('Dummy orders inserted successfully');
    } catch (error) {
        console.log('Error inserting dummy orders: ', error);
    }
};

const dummyProducts = [
    {
        productId: 1,
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        price: 12000,
        category: 'Fiction',
        introduction:
            'The story of the fabulously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan.',
    },
    {
        productId: 2,
        title: 'To Kill a Mockingbird',
        author: 'Harper Lee',
        price: 15000,
        category: 'Fiction',
        introduction:
            'A young girl growing up in an Alabama town during the 1930s learns of injustice and racism in the South.',
    },
    {
        productId: 3,
        title: 'The Catcher in the Rye',
        author: 'J.D. Salinger',
        price: 18000,
        category: 'Fiction',
        introduction:
            'The story of Holden Caulfield, a teenager who experiences alienation and disillusionment with society.',
    },
    {
        productId: 4,
        title: '1984',
        author: 'George Orwell',
        price: 20000,
        category: 'Fiction',
        introduction:
            'A dystopian novel set in a totalitarian society where the government controls every aspect of citizens’ lives.',
    },
    {
        productId: 5,
        title: 'The Hobbit',
        author: 'J.R.R. Tolkien',
        price: 25000,
        category: 'Fiction',
        introduction:
            'The story of Bilbo Baggins, a hobbit who embarks on a quest to reclaim a treasure stolen by a dragon.',
    },
    {
        productId: 6,
        title: 'Pride and Prejudice',
        author: 'Jane Austen',
        price: 18000,
        category: 'Fiction',
        introduction:
            'The story of Elizabeth Bennet and her relationship with the aloof Mr. Darcy.',
    },
    {
        productId: 7,
        title: 'The Odyssey',
        author: 'Homer',
        price: 22000,
        category: 'Fiction',
        introduction:
            'The epic poem that tells the story of Odysseus and his ten-year journey home after the Trojan War.',
    },
    {
        productId: 8,
        title: 'The Iliad',
        author: 'Homer',
        price: 22000,
        category: 'Fiction',
        introduction: 'The epic poem that tells the story of the Trojan War and the hero Achilles.',
    },
    {
        productId: 9,
        title: 'The Picture of Dorian Gray',
        author: 'Oscar Wilde',
        price: 15000,
        category: 'Fiction',
        introduction:
            'The story of a young man who remains youthful and handsome while a portrait of him ages and reveals his true character.',
    },
    {
        productId: 10,
        title: 'The Adventures of Tom Sawyer',
        author: 'Mark Twain',
        price: 12000,
        category: 'Fiction',
        introduction:
            'The story of a young boy growing up along the Mississippi River in the mid-1800s.',
    },
    {
        productId: 11,
        title: 'The Glass Castle',
        author: 'Jeannette Walls',
        price: 15000,
        category: 'Memoir',
        introduction:
            'The memoir of journalist Jeannette Walls, describing her childhood spent with her dysfunctional family.',
    },
    {
        productId: 12,
        title: 'Just Kids',
        author: 'Patti Smith',
        price: 20000,
        category: 'Memoir',
        introduction:
            'The memoir of musician Patti Smith, recounting her experiences as an artist and her relationship with photographer Robert Mapplethorpe.',
    },
    {
        productId: 13,
        title: 'Bossypants',
        author: 'Tina Fey',
        price: 18000,
        category: 'Memoir',
        introduction:
            'The memoir of comedian and writer Tina Fey, describing her experiences in show business and personal life.',
    },
    {
        productId: 14,
        title: 'Hunger',
        author: 'Roxane Gay',
        price: 17000,
        category: 'Memoir',
        introduction:
            'The memoir of writer Roxane Gay, describing her experiences with body image and trauma.',
    },
    {
        productId: 15,
        title: 'I Know Why the Caged Bird Sings',
        author: 'Maya Angelou',
        price: 16000,
        category: 'Memoir',
        introduction:
            'The memoir of poet and writer Maya Angelou, recounting her experiences growing up in the American South during segregation.',
    },
    {
        productId: 16,
        title: 'The Year of Magical Thinking',
        author: 'Joan Didion',
        price: 19000,
        category: 'Memoir',
        introduction:
            'The memoir of writer Joan Didion, describing her experiences coping with the death of her husband.',
    },
    {
        productId: 17,
        title: 'When Breath Becomes Air',
        author: 'Paul Kalanithi',
        price: 22000,
        category: 'Memoir',
        introduction:
            'The memoir of neurosurgeon Paul Kalanithi, describing his experiences facing terminal cancer and reflecting on the meaning of life.',
    },
    {
        productId: 18,
        title: 'Born Standing Up',
        author: 'Steve Martin',
        price: 21000,
        category: 'Memoir',
        introduction:
            'The memoir of comedian and actor Steve Martin, recounting his experiences in show business and personal life.',
    },
    {
        productId: 19,
        title: 'Wild',
        author: 'Cheryl Strayed',
        price: 17000,
        category: 'Memoir',
        introduction:
            'The memoir of writer Cheryl Strayed, describing her experiences hiking the Pacific Crest Trail and dealing with personal loss.',
    },
    {
        productId: 20,
        title: 'Open',
        author: 'Andre Agassi',
        price: 22000,
        category: 'Memoir',
        introduction:
            'The memoir of tennis player Andre Agassi, describing his experiences in the sport and personal life.',
    },
    {
        productId: 21,
        title: 'Atomic Habits',
        author: 'James Clear',
        price: 18000,
        category: 'Self-help',
        introduction:
            'A guide to developing good habits and breaking bad ones, based on scientific research and personal experience.',
    },
    {
        productId: 22,
        title: 'The 7 Habits of Highly Effective People',
        author: 'Stephen Covey',
        price: 20000,
        category: 'Self-help',
        introduction:
            'A guide to personal and professional development, based on seven key habits and principles.',
    },
    {
        productId: 23,
        title: 'Think and Grow Rich',
        author: 'Napoleon Hill',
        price: 15000,
        category: 'Self-help',
        introduction:
            'A motivational book that teaches the importance of positive thinking and perseverance in achieving success.',
    },
    {
        productId: 24,
        title: 'How to Win Friends and Influence People',
        author: 'Dale Carnegie',
        price: 17000,
        category: 'Self-help',
        introduction:
            'A self-help book that teaches the importance of interpersonal skills in personal and professional relationships.',
    },
    {
        productId: 25,
        title: 'The Power of Positive Thinking',
        author: 'Norman Vincent Peale',
        price: 16000,
        category: 'Self-help',
        introduction:
            'A self-help book that teaches the importance of positive thinking and visualization in achieving success and happiness.',
    },
    {
        productId: 26,
        title: 'The Miracle Morning',
        author: 'Hal Elrod',
        price: 19000,
        category: 'Self-help',
        introduction:
            'A guide to developing a morning routine that promotes personal growth and success.',
    },
    {
        productId: 27,
        title: 'The Subtle Art of Not Giving a F*ck',
        author: 'Mark Manson',
        price: 22000,
        category: 'Self-help',
        introduction:
            'A self-help book that teaches the importance of focusing on what really matters in life and letting go of negativity.',
    },
    {
        productId: 28,
        title: "Man's Search for Meaning",
        author: 'Viktor Frankl',
        price: 21000,
        category: 'Self-help',
        introduction:
            "A memoir and philosophical treatise that explores the meaning of life and human suffering, based on the author's experiences in Nazi concentration camps.",
    },
    {
        productId: 29,
        title: 'The 5 Love Languages',
        author: 'Gary Chapman',
        price: 17000,
        category: 'Self-help',
        introduction:
            'A guide to understanding and expressing love in different ways, based on five different "love languages."',
    },
    {
        productId: 30,
        title: 'Getting Things Done',
        author: 'David Allen',
        price: 22000,
        category: 'Self-help',
        introduction:
            'A guide to personal and professional productivity, based on a system of organization and prioritization.',
    },
    {
        productId: 31,
        title: 'Clean Code',
        author: 'Robert C. Martin',
        price: 25000,
        category: 'Computer Science',
        introduction: 'A guide to writing clean, maintainable code in any programming language.',
    },
    {
        productId: 32,
        title: 'Designing Data-Intensive Applications',
        author: 'Martin Kleppmann',
        price: 35000,
        category: 'Computer Science',
        introduction:
            'A book that explores the design principles of scalable, distributed systems for processing large volumes of data.',
    },
    {
        productId: 33,
        title: 'The Pragmatic Programmer',
        author: 'Andrew Hunt and David Thomas',
        price: 20000,
        category: 'Computer Science',
        introduction:
            'A guide to software development best practices and techniques for creating high-quality, maintainable code.',
    },
    {
        productId: 34,
        title: 'Cracking the Coding Interview',
        author: 'Gayle Laakmann McDowell',
        price: 30000,
        category: 'Computer Science',
        introduction:
            'A comprehensive guide to preparing for coding interviews, with tips and practice questions for software engineering candidates.',
    },
    {
        productId: 35,
        title: 'Code Complete',
        author: 'Steve McConnell',
        price: 27000,
        category: 'Computer Science',
        introduction:
            'A guide to software development best practices, covering topics such as coding style, debugging, and testing.',
    },
    {
        productId: 36,
        title: 'The Algorithm Design Manual',
        author: 'Steven S. Skiena',
        price: 32000,
        category: 'Computer Science',
        introduction:
            'A comprehensive guide to algorithms and data structures, with a focus on practical design and implementation.',
    },
    {
        productId: 37,
        title: 'Introduction to Algorithms',
        author: 'Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest, and Clifford Stein',
        price: 40000,
        category: 'Computer Science',
        introduction:
            'A classic textbook on algorithms and data structures, used in many computer science courses.',
    },
    {
        productId: 38,
        title: 'Code: The Hidden Language of Computer Hardware and Software',
        author: 'Charles Petzold',
        price: 23000,
        category: 'Computer Science',
        introduction:
            'A book that explains how computers work, from the basic principles of digital circuits to the high-level programming languages that humans use to communicate with them.',
    },
    {
        productId: 39,
        title: 'The Mythical Man-Month',
        author: 'Frederick P. Brooks Jr.',
        price: 28000,
        category: 'Computer Science',
        introduction:
            'A classic book on software engineering, exploring the challenges of managing large-scale software projects and teams.',
    },
    // 도서 카테고리: 컴퓨터 과학,자기계발,
    {
        productId: 40,
        title: 'The Art of Computer Programming',
        author: 'Donald E. Knuth',
        price: 50000,
        category: 'Computer Science',
        introduction:
            'A comprehensive, multi-volume textbook on computer programming and algorithms, widely regarded as a classic of the field.',
    },
    {
        productId: 41,
        title: 'The Wealth of Nations',
        author: 'Adam Smith',
        price: 15000,
        category: 'Economics',
        introduction:
            'A classic treatise on economics, in which Smith argued that the division of labor and free markets lead to economic prosperity and growth.',
    },
    {
        productId: 42,
        title: 'Capital in the Twenty-First Century',
        author: 'Thomas Piketty',
        price: 30000,
        category: 'Economics',
        introduction:
            'A book that analyzes the distribution of wealth and income in developed countries over the past century, and argues that inequality is a major challenge for democratic societies.',
    },
    {
        productId: 43,
        title: 'The General Theory of Employment, Interest, and Money',
        author: 'John Maynard Keynes',
        price: 22000,
        category: 'Economics',
        introduction:
            'A foundational work of macroeconomic theory, in which Keynes argued that government intervention is necessary to stabilize economies and prevent depression.',
    },
    {
        productId: 44,
        title: 'Freakonomics',
        author: 'Steven D. Levitt and Stephen J. Dubner',
        price: 18000,
        category: 'Economics',
        introduction:
            'A book that uses economic analysis to explore a range of social and cultural phenomena, from cheating in sumo wrestling to the impact of legalized abortion on crime rates.',
    },
    {
        productId: 45,
        title: 'Thinking, Fast and Slow',
        author: 'Daniel Kahneman',
        price: 25000,
        category: 'Economics',
        introduction:
            'A book that explores the cognitive biases and heuristics that shape human decision-making, and their implications for economics, psychology, and public policy.',
    },
    {
        productId: 46,
        title: 'Nudge',
        author: 'Richard H. Thaler and Cass R. Sunstein',
        price: 19000,
        category: 'Economics',
        introduction:
            'A book that explores how people make decisions and how choice architecture can be used to influence behavior in positive ways.',
    },
    {
        productId: 47,
        title: 'The Shock Doctrine',
        author: 'Naomi Klein',
        price: 28000,
        category: 'Economics',
        introduction:
            'A book that explores the history of neoliberal economic policies, arguing that they have been imposed on countries around the world through crisis and disaster.',
    },
    {
        productId: 48,
        title: 'The Big Short',
        author: 'Michael Lewis',
        price: 20000,
        category: 'Economics',
        introduction:
            'A book that tells the story of the financial crisis of 2008 through the experiences of a handful of investors who saw it coming and bet against the housing market.',
    },
    {
        productId: 49,
        title: 'Misbehaving',
        author: 'Richard H. Thaler',
        price: 23000,
        category: 'Economics',
        introduction:
            'A memoir and intellectual history of behavioral economics, in which Thaler discusses his work on decision-making and how it has influenced public policy.',
    },
    {
        productId: 50,
        title: 'The Great Transformation',
        author: 'Karl Polanyi',
        price: 32000,
        category: 'Economics',
        introduction:
            'A book that explores the origins of capitalism and the rise of the modern economy, arguing that the transition from a market economy to a market society was a radical change.',
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

const dummyUsers = [
    {
        userId: 'user1',
        password: bcrypt.hashSync('password1', 10),
        email: 'user1@example.com',
        userName: 'John Doe',
        role: 'user',
        tokens: {
            accessToken: 'dummy_access_token_1',
            refreshToken: 'dummy_refresh_token_1',
        },
    },
    {
        userId: 'admin1',
        password: bcrypt.hashSync('password1', 10),
        email: 'admin1@example.com',
        userName: 'Jane Doe',
        role: 'admin',
        tokens: {
            accessToken: 'dummy_access_token_2',
            refreshToken: 'dummy_refresh_token_2',
        },
    },
    {
        userId: 'user2',
        password: bcrypt.hashSync('password2', 10),
        email: 'user2@example.com',
        userName: 'Alice',
        role: 'user',
        tokens: {
            accessToken: 'dummy_access_token_3',
            refreshToken: 'dummy_refresh_token_3',
        },
    },
    {
        userId: 'admin2',
        password: bcrypt.hashSync('password2', 10),
        email: 'admin2@example.com',
        userName: 'Bob',
        role: 'admin',
        tokens: {
            accessToken: 'dummy_access_token_4',
            refreshToken: 'dummy_refresh_token_4',
        },
    },
    {
        userId: 'user3',
        password: bcrypt.hashSync('password3', 10),
        email: 'user3@example.com',
        userName: 'Eve',
        role: 'user',
        tokens: {
            accessToken: 'dummy_access_token_5',
            refreshToken: 'dummy_refresh_token_5',
        },
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

module.exports = { insertDummyUsers, insertDummyProducts, insertDummyOrders };
