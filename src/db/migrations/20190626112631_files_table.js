'use strict';
exports.up = function(knex, Promise) {
    return knex.schema
        .createTable('files', function(table) {
            table.increments('id');
            table.string('name', 255);
            table
                .string('status', 10)
                .defaultTo('pending')
                .comment('pending, success, error');
            table.string('type', 10).comment('type of file csv,pdf');
            table.string('size').nullable();
            table.string('path', 1000).comment('path to download');
            table.string('uuid', 255).comment('user uuid');
            table.timestamps(true, true);
            table.timestamp('deleted_at').nullable();

            // indexes
            table.index('name');
            table.index('status');
            table.index('type');
            table.index('uuid');
            table.index('deleted_at');
        })
        .then(function() {
            console.log('files table has been created');
        });
};
exports.down = function(knex, Promise) {
    return knex.schema.dropTable('files');
};
