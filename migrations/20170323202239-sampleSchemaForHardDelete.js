/**
 * Copyright (c) 2017, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or
 * https://opensource.org/licenses/BSD-3-Clause
 */
'use strict';
const TBL = 'Samples';
module.exports = {
  up(qi, Sequelize) {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return qi.createTable('users', { id: Sequelize.INTEGER });
    */
    return qi.sequelize.transaction(() => qi.removeColumn(TBL, 'deletedAt'))
    .then(() => qi.removeIndex(TBL, 'samples_aspect_id_subject_id_is_deleted'))
    .then(() => qi.removeIndex(TBL, 'SampleStatusDeletedAt'))
    .then(() => qi.addIndex(TBL, ['status'],
      { indexName: 'SampleStatus' }))
    .then(() => qi.addIndex(TBL, ['aspectId', 'subjectId'],
      { indexName: 'AspectIdSubjectId' }));
  },

  down(qi, Sequelize) {
    // /*
    //   Add reverting commands here.
    //   Return a promise to correctly handle asynchronicity.

    //   Example:
    //   return qi.dropTable('users');
    // */
    return qi.sequelize.transaction(() => qi.addColumn(TBL, 'deletedAt', {
      type: Sequelize.DATE,
      allowNull: true,
    }))
    .then(() => qi.addIndex(TBL, ['aspectId', 'subjectId', 'isDeleted'],
      { unique: true, indexName: 'samples_aspect_id_subject_id_is_deleted' }))
    .then(() => qi.addIndex(TBL, ['status', 'deletedAt'],
      { indexName: 'SampleStatusDeletedAt' }))
    .then(() => qi.removeIndex(TBL, 'SampleStatus'))
    .then(() => qi.removeIndex(TBL, 'AspectIdSubjectId'));
  },
};