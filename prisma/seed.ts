import 'dotenv/config';
import { prisma } from './lib/prisma';
import { assertSeedImagesReady, getSeedImage } from './lib/seedImages';

async function main() {
  assertSeedImagesReady();
  await prisma.$transaction(
    async (tx) => {
      await tx.payment.deleteMany();
      await tx.orderItem.deleteMany();
      await tx.order.deleteMany();
      await tx.review.deleteMany();
      await tx.cartItem.deleteMany();
      await tx.product.deleteMany();
      await tx.address.deleteMany();
      await tx.account.deleteMany();
      await tx.category.deleteMany();
      await tx.user.deleteMany();

      const userData = [
        ['alice@example.com', 'Alice Johnson'],
        ['bob@example.com', 'Bob Smith'],
        ['carol@example.com', 'Carol Williams'],
        ['david@example.com', 'David Brown'],
        ['emma@example.com', 'Emma Davis'],
        ['frank@example.com', 'Frank Miller'],
        ['grace@example.com', 'Grace Wilson'],
        ['henry@example.com', 'Henry Moore'],
        ['isla@example.com', 'Isla Taylor'],
        ['jack@example.com', 'Jack Anderson'],
        ['kate@example.com', 'Kate Thomas'],
        ['liam@example.com', 'Liam Jackson'],
      ];
      const users = await Promise.all(
        userData.map(([email, name]) =>
          tx.user.create({
            data: { email, name, password: 'MockPassword123!' },
          }),
        ),
      );
      const user = Object.fromEntries(users.map((record) => [record.email!, record]));

      const rootCategories = await Promise.all([
        tx.category.create({ data: { name: 'Electronics', slug: 'electronics' } }),
        tx.category.create({ data: { name: 'Home & Kitchen', slug: 'home-kitchen' } }),
        tx.category.create({ data: { name: 'Sports & Outdoors', slug: 'sports-outdoors' } }),
        tx.category.create({ data: { name: 'Books', slug: 'books' } }),
        tx.category.create({ data: { name: 'Fashion', slug: 'fashion' } }),
      ]);
      const root = Object.fromEntries(rootCategories.map((record) => [record.slug, record]));
      const childCategories = await Promise.all([
        tx.category.create({
          data: { name: 'Audio', slug: 'audio', parentId: root.electronics.id },
        }),
        tx.category.create({
          data: { name: 'Computers', slug: 'computers', parentId: root.electronics.id },
        }),
        tx.category.create({
          data: { name: 'Cameras', slug: 'cameras', parentId: root.electronics.id },
        }),
        tx.category.create({
          data: { name: 'Kitchen', slug: 'kitchen', parentId: root['home-kitchen'].id },
        }),
        tx.category.create({
          data: { name: 'Fitness', slug: 'fitness', parentId: root['sports-outdoors'].id },
        }),
        tx.category.create({ data: { name: 'Fiction', slug: 'fiction', parentId: root.books.id } }),
        tx.category.create({
          data: { name: 'Accessories', slug: 'accessories', parentId: root.fashion.id },
        }),
      ]);
      const category = Object.fromEntries(
        [...rootCategories, ...childCategories].map((record) => [record.slug, record]),
      );

      const productData = [
        [
          'noise-cancelling-headphones',
          'Noise Cancelling Headphones',
          'alice@example.com',
          'audio',
          42,
          '129.99',
          '10.00',
        ],
        [
          'mechanical-keyboard',
          'Mechanical Keyboard',
          'bob@example.com',
          'computers',
          18,
          '89.50',
          '0.00',
        ],
        [
          '4k-usb-c-monitor',
          '4K USB-C Monitor',
          'carol@example.com',
          'computers',
          25,
          '349.00',
          '15.00',
        ],
        [
          'pour-over-coffee-maker',
          'Pour-Over Coffee Maker',
          'david@example.com',
          'kitchen',
          60,
          '34.95',
          '0.00',
        ],
        [
          'smart-table-lamp',
          'Smart Table Lamp',
          'emma@example.com',
          'home-kitchen',
          12,
          '59.99',
          '0.00',
        ],
        [
          'mirrorless-camera',
          'Compact Mirrorless Camera',
          'frank@example.com',
          'cameras',
          9,
          '799.00',
          '8.00',
        ],
        [
          'wireless-earbuds',
          'Wireless Earbuds',
          'grace@example.com',
          'audio',
          55,
          '74.99',
          '12.00',
        ],
        [
          'ergonomic-office-chair',
          'Ergonomic Office Chair',
          'henry@example.com',
          'home-kitchen',
          14,
          '249.95',
          '5.00',
        ],
        [
          'cast-iron-skillet',
          'Cast Iron Skillet',
          'isla@example.com',
          'kitchen',
          31,
          '39.99',
          '0.00',
        ],
        ['yoga-mat', 'Non-Slip Yoga Mat', 'jack@example.com', 'fitness', 80, '28.50', '0.00'],
        [
          'adjustable-dumbbells',
          'Adjustable Dumbbells',
          'kate@example.com',
          'fitness',
          16,
          '179.99',
          '10.00',
        ],
        [
          'running-backpack',
          'Lightweight Running Backpack',
          'liam@example.com',
          'sports-outdoors',
          28,
          '44.00',
          '0.00',
        ],
        [
          'the-last-lighthouse',
          'The Last Lighthouse',
          'alice@example.com',
          'fiction',
          45,
          '16.99',
          '0.00',
        ],
        [
          'practical-typescript',
          'Practical TypeScript',
          'bob@example.com',
          'books',
          22,
          '42.00',
          '5.00',
        ],
        [
          'leather-crossbody-bag',
          'Leather Crossbody Bag',
          'carol@example.com',
          'accessories',
          19,
          '89.00',
          '15.00',
        ],
        [
          'classic-sunglasses',
          'Classic Polarized Sunglasses',
          'david@example.com',
          'accessories',
          37,
          '39.95',
          '0.00',
        ],
        [
          'smartwatch-active',
          'Active Series Smartwatch',
          'emma@example.com',
          'electronics',
          24,
          '199.99',
          '10.00',
        ],
        [
          'portable-projector',
          'Portable HD Projector',
          'frank@example.com',
          'electronics',
          11,
          '289.00',
          '12.00',
        ],
        [
          'bluetooth-speaker',
          'Waterproof Bluetooth Speaker',
          'grace@example.com',
          'audio',
          47,
          '64.99',
          '0.00',
        ],
        [
          'standing-desk',
          'Electric Standing Desk',
          'henry@example.com',
          'home-kitchen',
          8,
          '429.00',
          '7.00',
        ],
      ] as const;
      const products = await Promise.all(
        productData.map(([slug, title, ownerEmail, categorySlug, stock, price, discount]) =>
          tx.product.create({
            data: {
              userId: user[ownerEmail].id,
              categoryId: category[categorySlug].id,
              stock,
              title,
              description: `${title} made for reliable everyday use.`,
              price,
              image: getSeedImage(slug),
              discount,
              slug,
            },
          }),
        ),
      );
      const product = Object.fromEntries(products.map((record) => [record.slug, record]));

      const addressData = [
        ['alice@example.com', '12 Market Street', 'Boston', 'MA', '02108'],
        ['alice@example.com', '90 Beacon Avenue', 'Cambridge', 'MA', '02139'],
        ['bob@example.com', '88 Pine Avenue', 'Seattle', 'WA', '98101'],
        ['carol@example.com', '415 Lake Drive', 'Chicago', 'IL', '60601'],
        ['david@example.com', '27 Oak Road', 'Austin', 'TX', '78701'],
        ['emma@example.com', '63 Willow Lane', 'Denver', 'CO', '80202'],
        ['frank@example.com', '144 Sunset Boulevard', 'Los Angeles', 'CA', '90012'],
        ['grace@example.com', '8 River Street', 'Portland', 'OR', '97205'],
        ['henry@example.com', '301 Garden Way', 'New York', 'NY', '10001'],
        ['isla@example.com', '52 Maple Court', 'Atlanta', 'GA', '30303'],
        ['jack@example.com', '19 Cedar Street', 'Miami', 'FL', '33101'],
        ['kate@example.com', '77 Birch Avenue', 'Phoenix', 'AZ', '85004'],
      ] as const;
      const addresses = await Promise.all(
        addressData.map(([email, street, city, state, postalCode]) =>
          tx.address.create({
            data: { userId: user[email].id, street, city, state, postalCode, country: 'USA' },
          }),
        ),
      );

      await tx.account.createMany({
        data: [
          ['alice@example.com', 'github', 'seed-alice-github', 'alice-demo'],
          ['bob@example.com', 'google', 'seed-bob-google', 'bob-demo'],
          ['carol@example.com', 'github', 'seed-carol-github', 'carol-demo'],
          ['david@example.com', 'google', 'seed-david-google', 'david-demo'],
          ['emma@example.com', 'github', 'seed-emma-github', 'emma-demo'],
          ['frank@example.com', 'google', 'seed-frank-google', 'frank-demo'],
        ].map(([email, provider, providerAccountId, username]) => ({
          userId: user[email].id,
          provider,
          providerAccountId,
          username,
        })),
      });

      await tx.cartItem.createMany({
        data: (
          [
            ['alice@example.com', 'noise-cancelling-headphones', 1],
            ['alice@example.com', 'mechanical-keyboard', 2],
            ['alice@example.com', 'the-last-lighthouse', 1],
            ['bob@example.com', '4k-usb-c-monitor', 1],
            ['bob@example.com', 'wireless-earbuds', 1],
            ['carol@example.com', 'cast-iron-skillet', 2],
            ['david@example.com', 'yoga-mat', 1],
            ['emma@example.com', 'smartwatch-active', 1],
            ['frank@example.com', 'portable-projector', 1],
            ['grace@example.com', 'bluetooth-speaker', 2],
            ['henry@example.com', 'standing-desk', 1],
          ] as const
        ).map(([email, slug, quantity]) => ({
          userId: user[email].id,
          productId: product[slug].id,
          quantity,
        })),
      });

      const orderData = [
        ['alice@example.com', 0, '219.49', 'DELIVERED', 'CREDIT_CARD'],
        ['bob@example.com', 2, '349.00', 'SHIPPED', 'PAYPAL'],
        ['carol@example.com', 3, '79.98', 'PENDING', 'CREDIT_CARD'],
        ['david@example.com', 4, '28.50', 'PROCESSING', 'CREDIT_CARD'],
        ['emma@example.com', 5, '199.99', 'DELIVERED', 'PAYPAL'],
        ['frank@example.com', 6, '1088.00', 'SHIPPED', 'CREDIT_CARD'],
        ['grace@example.com', 7, '129.98', 'DELIVERED', 'CREDIT_CARD'],
        ['henry@example.com', 8, '429.00', 'PENDING', 'PAYPAL'],
        ['isla@example.com', 9, '39.95', 'PROCESSING', 'CREDIT_CARD'],
        ['jack@example.com', 10, '44.00', 'DELIVERED', 'CREDIT_CARD'],
      ] as const;
      const orders = await Promise.all(
        orderData.map(([email, addressIndex, totalAmount, status, paymentMethod]) =>
          tx.order.create({
            data: {
              userId: user[email].id,
              addressId: addresses[addressIndex].id,
              totalAmount,
              status,
              paymentMethod,
            },
          }),
        ),
      );

      const orderItems = [
        [0, 'noise-cancelling-headphones', 1, '129.99'],
        [0, 'mechanical-keyboard', 1, '89.50'],
        [1, '4k-usb-c-monitor', 1, '349.00'],
        [2, 'cast-iron-skillet', 2, '39.99'],
        [3, 'yoga-mat', 1, '28.50'],
        [4, 'smartwatch-active', 1, '199.99'],
        [5, 'mirrorless-camera', 1, '799.00'],
        [5, 'portable-projector', 1, '289.00'],
        [6, 'wireless-earbuds', 1, '74.99'],
        [6, 'bluetooth-speaker', 1, '64.99'],
        [7, 'standing-desk', 1, '429.00'],
        [8, 'classic-sunglasses', 1, '39.95'],
        [9, 'running-backpack', 1, '44.00'],
      ] as const;
      await tx.orderItem.createMany({
        data: orderItems.map(([orderIndex, slug, quantity, price]) => ({
          orderId: orders[orderIndex].id,
          productId: product[slug].id,
          quantity,
          price,
        })),
      });
      await tx.payment.createMany({
        data: orders.map((order, index) => ({
          orderId: order.id,
          transactionId: `seed-txn-${String(index + 1).padStart(3, '0')}`,
          amount: orderData[index][2],
          status: index === 2 || index === 7 ? 'PENDING' : 'COMPLETED',
        })),
      });

      const reviewData = [
        [
          'noise-cancelling-headphones',
          'alice@example.com',
          5,
          'Comfortable and effective for long work sessions.',
        ],
        ['mechanical-keyboard', 'bob@example.com', 4, 'Solid build and pleasant switches.'],
        ['4k-usb-c-monitor', 'carol@example.com', 5, 'Sharp image and a very clean USB-C setup.'],
        ['wireless-earbuds', 'david@example.com', 4, 'Good sound and reliable battery life.'],
        ['cast-iron-skillet', 'emma@example.com', 5, 'Heats evenly and feels built to last.'],
        ['yoga-mat', 'frank@example.com', 4, 'Comfortable grip for daily practice.'],
        [
          'smartwatch-active',
          'grace@example.com',
          5,
          'Useful activity tracking without being bulky.',
        ],
        ['portable-projector', 'henry@example.com', 4, 'Easy to set up for movie nights.'],
        ['bluetooth-speaker', 'isla@example.com', 5, 'Surprisingly clear sound outdoors.'],
        ['the-last-lighthouse', 'jack@example.com', 4, 'A thoughtful and atmospheric read.'],
        ['leather-crossbody-bag', 'kate@example.com', 5, 'Great size and excellent stitching.'],
        ['standing-desk', 'liam@example.com', 4, 'Quiet motor and plenty of workspace.'],
      ] as const;
      await tx.review.createMany({
        data: reviewData.map(([slug, email, rating, comment]) => ({
          productId: product[slug].id,
          userId: user[email].id,
          rating,
          comment,
        })),
      });
    },
    { timeout: 30000 },
  );
}

main()
  .then(() => console.log('Seed completed successfully.'))
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
