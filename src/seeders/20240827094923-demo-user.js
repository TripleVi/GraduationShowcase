'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */

    // Admin
    await queryInterface.bulkInsert('user', [{
      email: 'baongoc@fpt.edu.vn',
      username: 'baongoc12345',
      name: 'Hoang Bao Ngoc',
      avatar_url: 'https://lh3.googleusercontent.com/a/ACg8ocLlj6zkmkFesMZO8I-oPDjPJfBo0E9LPGbCfxeqd6Qv0YEzukOl=s96-c',
      password: '$2a$10$MXf1bT2/PCforGDEwwuwE.6olFlWPc/sFIl4n4a9t4a1przq9geFC',
      role_id: 1,
      created_at: new Date(),
      updated_at: new Date(),
    }]);

    // User
    // return queryInterface.bulkInsert('user', [{
    //   email: 'vuongvu061101@gmail.com',
    //   username: 'rosie_cheek01',
    //   password: '$2a$10$eHsHYbOPTRCm2sxezZFgwuCVXex.aH.ZzTx5vZKDpl5vXp1cFuCL.',
    //   role_id: 2,
    //   created_at: new Date(),
    //   updated_at: new Date(),
    // }]);
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
