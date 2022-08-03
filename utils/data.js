import bcrypt from 'bcryptjs';

const data = {
  users: [
    {
      name: 'Taylor',
      email: 'trw0511@gmail.com',
      password: bcrypt.hashSync('123456'),
      isAdmin: true,
    },
    {
      name: 'Lily',
      email: 'trw0511@yahoo.com',
      password: bcrypt.hashSync('123456'),
      isAdmin: false,
    },
  ],
  products: [
    {
      name: 'Studs',
      slug: 'studs',
      category: 'Earrings',
      image: '/images/earring1.jpg',
      price: 20,
      rating: 5,
      numReviews: 3,
      countInStock: 15,
      description: 'Pretty shits',
    },
    {
      name: 'Danglies',
      slug: 'danglies',
      category: 'Earrings',
      image: '/images/earring2.jpg',
      price: 30,
      rating: 4,
      numReviews: 33,
      countInStock: 5,
      description: 'Pretty shits danglin',
    },
    {
      name: 'Hoops',
      slug: 'hoops',
      category: 'Earrings',
      image: '/images/earring3.jpg',
      price: 15,
      rating: 4.5,
      numReviews: 31,
      countInStock: 18,
      description: 'Pretty shits hoopin',
    },
    {
      name: 'Gem Necklace',
      slug: 'gem-necklace',
      category: 'Necklaces',
      image: '/images/necklace1.jpg',
      price: 20,
      rating: 5,
      numReviews: 3,
      countInStock: 15,
      description: 'Pretty shits neckin',
    },
    {
      name: 'Necklace again',
      slug: 'necklace-again',
      category: 'Necklaces',
      image: '/images/necklace2.jpg',
      price: 25,
      rating: 5,
      numReviews: 3,
      countInStock: 15,
      description: 'Pretty shits neckin twice',
    },
  ],
};

export default data;
