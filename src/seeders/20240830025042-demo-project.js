'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    let suffix = 1000000000000
    const projects = new Array(100).fill(0).map(_ => {
      return {
        title: `Human Activity Recognition ${suffix++}`,
        description: 'Human Activity Recognition (HAR) is a branch of computational science and engineering that tries to create systems and techniques capable of automatically recognizing and categorizing human actions based on sensor data.',
        year: 2025,
        video_id: 'Ey9OpEQ1plY',
        topic_id: 2,
        report_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
      }
    })
    return queryInterface.bulkInsert('project', projects);
    return queryInterface.bulkInsert('project', [
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
