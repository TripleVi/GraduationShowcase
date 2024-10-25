'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // let suffix = 1000000000000
    // const topics = new Array(100).fill(0).map(_ => {
    //   return {
    //     name: `Topic Name ${suffix++}`,
    //     major_id: 1,
    //     created_at: new Date(),
    //     updated_at: new Date(),
    //   }
    // })
    // return queryInterface.bulkInsert('topic', topics);
    return queryInterface.bulkInsert('topic', [
      {
        name: 'Web',
        major_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Mobile',
        major_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Blockchain',
        major_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
