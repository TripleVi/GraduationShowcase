'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Major', [
      {
        name: 'Information Technology',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Artificial Intelligence',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Graphic & Digital Design',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Business Administration',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Marketing Management',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Event Management',
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
