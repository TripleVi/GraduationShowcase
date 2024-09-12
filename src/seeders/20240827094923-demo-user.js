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
    // return queryInterface.bulkInsert('User', [{
    //   email: 'vuongvvgch190692@fpt.edu.vn',
    //   username: 'vuongvvgch190692',
    //   password: '$2a$10$DK0WVyqfBzwH.e.DKttu8.m/R/l3FjaXeHy64l5NOvBBs5BK8zNga',
    //   role_id: 1,
    //   created_at: new Date(),
    //   updated_at: new Date(),
    // }]);

    // User
    return queryInterface.bulkInsert('User', [{
      email: 'vuongvu061101@gmail.com',
      username: 'rosie_cheek01',
      password: '$2a$10$eHsHYbOPTRCm2sxezZFgwuCVXex.aH.ZzTx5vZKDpl5vXp1cFuCL.',
      role_id: 2,
      created_at: new Date(),
      updated_at: new Date(),
    }]);
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
