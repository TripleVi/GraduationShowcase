'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    let suffix = 1000000000000
    const majors = new Array(100).fill(0).map(_ => {
      return {
        name: `Major Name ${suffix++}`,
        created_at: new Date(),
        updated_at: new Date(),
      }
    })
    return queryInterface.bulkInsert('major', majors);
    return queryInterface.bulkInsert('major', [
      {
        name: 'Information Technology',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Artificial Intelligence',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Graphic & Digital Design',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Business Administration',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Marketing Management',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Event Management',
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
