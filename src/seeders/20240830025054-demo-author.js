'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Author', [
      {
        name: 'Vu Van Vuong',
        email: 'vuongvu0611@gmail.com',
        avatar_id: 5,
        project_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Rosie Cheeks',
        email: 'vuongvvgch190692@gmail.com',
        avatar_id: 6,
        project_id: 1,
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
