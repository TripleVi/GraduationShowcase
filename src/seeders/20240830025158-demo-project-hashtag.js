'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Project_Hashtag', [
      {
        project_id: 1,
        hashtag_id: 2,
      },
      {
        project_id: 1,
        hashtag_id: 4,
      },
      {
        project_id: 1,
        hashtag_id: 5,
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
