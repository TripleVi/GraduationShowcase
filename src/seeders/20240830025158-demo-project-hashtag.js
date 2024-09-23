'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('project_hashtag', [
      {
        project_id: 2,
        hashtag_id: 1,
      },
      {
        project_id: 2,
        hashtag_id: 2,
      },
      {
        project_id: 2,
        hashtag_id: 3,
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
