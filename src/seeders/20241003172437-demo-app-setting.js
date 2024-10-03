'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const value = JSON.stringify({
      database: {
        retainDays: 10,
        hours: [3],
      },
    })
    return queryInterface.bulkInsert('app_setting', [
      {
        type: 'backup',
        value,
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
