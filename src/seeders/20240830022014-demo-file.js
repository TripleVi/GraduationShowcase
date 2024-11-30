'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('file', [
      {
        url: 'https://media-cdn-v2.laodong.vn/storage/newsportal/2024/6/19/1354832/Rose-Blackpink-1A.jpeg?w=460',
        name: 'report.pdf',
        original_name: 'report.pdf',
        size: '5000',
        mime_type: 'application/pdf',
        created_at: new Date(),
      },
      {
        url: 'https://media-cdn-v2.laodong.vn/storage/newsportal/2024/6/19/1354832/Rose-Blackpink-1A.jpeg?w=560',
        name: 'model.jpg',
        original_name: 'model.jpg',
        size: '5000',
        mime_type: 'image/jpeg',
        created_at: new Date(),
      },
      {
        url: 'https://media-cdn-v2.laodong.vn/storage/newsportal/2024/6/19/1354832/Rose-Blackpink-1A.jpeg?w=660',
        name: 'app.jpg',
        original_name: 'app.jpg',
        size: '5000',
        mime_type: 'image/jpeg',
        created_at: new Date(),
      },
      {
        url: 'https://media-cdn-v2.laodong.vn/storage/newsportal/2024/6/19/1354832/Rose-Blackpink-1A.jpeg?w=760',
        name: 'idea.jpg',
        original_name: 'idea.jpg',
        size: '5000',
        mime_type: 'image/jpeg',
        created_at: new Date(),
      },
      {
        url: 'https://i.mydramalist.com/66L5p_5c.jpg',
        name: 'avatar.jpg',
        original_name: 'avatar.jpg',
        size: '5000',
        mime_type: 'image/jpeg',
        created_at: new Date(),
      },
      {
        url: 'https://media-cdn-v2.laodong.vn/storage/newsportal/2024/6/19/1354832/Rose-Blackpink-1A.jpeg?w=360',
        name: 'avatar2.jpg',
        original_name: 'avatar2.jpg',
        size: '5000',
        mime_type: 'image/jpeg',
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
