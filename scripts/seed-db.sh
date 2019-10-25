#!/bin/bash
knex seed:run --env development --knexfile src/db/knexfile.js
