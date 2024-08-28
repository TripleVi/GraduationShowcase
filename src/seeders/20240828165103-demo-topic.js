'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Topic', [
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
