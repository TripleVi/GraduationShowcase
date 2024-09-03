'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Report', [
      {
        url: 'https://media-cdn-v2.laodong.vn/storage/newsportal/2024/6/19/1354832/Rose-Blackpink-1A.jpeg?w=660',
        name: 'report.pdf',
        size: '5000',
        mime_type: 'application/pdf',
        project_id: 1,
      }
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
