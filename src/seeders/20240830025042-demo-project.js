'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Project', [
      {
        title: 'Human Activity Recognition',
        description: 'Human Activity Recognition (HAR) is a branch of computational science and engineering that tries to create systems and techniques capable of automatically recognizing and categorizing human actions based on sensor data.',
        year: 2024,
        video_id: 'Ey9OpEQ1plY',
        topic_id: 1,
        report_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
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
