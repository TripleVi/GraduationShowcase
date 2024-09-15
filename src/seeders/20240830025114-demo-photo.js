'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('photo', [
      {
        project_id: 1,
        file_id: 2,
      },
      {
        project_id: 1,
        file_id: 3,
      },
      {
        project_id: 1,
        file_id: 4,
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
