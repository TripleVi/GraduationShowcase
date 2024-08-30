'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Hashtag', [
      {
        name: 'web',
        created_at: new Date(),
      },
      {
        name: 'Mobile',
        created_at: new Date(),
      },
      {
        name: 'blockchain',
        created_at: new Date(),
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
