'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Photo', [
      {
        url: 'https://media-cdn-v2.laodong.vn/storage/newsportal/2024/6/19/1354832/Rose-Blackpink-1A.jpeg?w=660',
        name: 'model.jpg',
        size: '5000',
        mime_type: 'image/jpeg',
        project_id: 1,
      },
      {
        url: 'https://media-cdn-v2.laodong.vn/storage/newsportal/2024/6/19/1354832/Rose-Blackpink-1A.jpeg?w=660',
        name: 'app.jpg',
        size: '5000',
        mime_type: 'image/jpeg',
        project_id: 1,
      },
      {
        url: 'https://media-cdn-v2.laodong.vn/storage/newsportal/2024/6/19/1354832/Rose-Blackpink-1A.jpeg?w=660',
        name: 'idea.jpg',
        size: '5000',
        mime_type: 'image/jpeg',
        project_id: 1,
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
