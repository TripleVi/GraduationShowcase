'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('comment', [
      {
        content: 'Suppose we want to insert some data into a few tables by default. If we follow up on the previous example we can consider creating a demo user for the User table.',
        project_id: 1,
        author_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        content: 'Note: Sequelize will only use Model files, it is the table representation. On the other hand, the migration file is a change in that model or more specifically that table, used by CLI. Treat migrations like a commit or a log for some change in database.',
        project_id: 1,
        author_id: 1,
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
