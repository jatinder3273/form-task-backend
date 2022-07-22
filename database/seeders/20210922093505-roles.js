'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

    return Promise.all([
      // queryInterface.bulkDelete('roles', null, { truncate: true }),
      queryInterface.bulkInsert('roles', [
        { role_id: 1, role: 'Admin', created_at: new Date(), updated_at: new Date() },
        { role_id: 2, role: 'Broker', created_at: new Date(), updated_at: new Date() },
        { role_id: 3, role: 'Broker_user', created_at: new Date(), updated_at: new Date() }
      ], {truncate: true})
    ])
  },
  
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('roles', null, { truncate: true });
    
  }
};
