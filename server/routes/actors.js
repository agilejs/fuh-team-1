/*jshint maxstatements:50 */

'use strict';
var uuid = require('node-uuid');
var logger = require('log4js').getLogger('routes/actors');

exports = module.exports = function (db) {

    if (!db) {
        throw new Error('No database configured');
    }

    var exports = {};

    // helper function to return the absolute base uri used in the request
    function getAbsoluteUriBase (req) {
        // we use req.get('host') as this also gives us the port
        return req.protocol + '://' + req.get('host');
    }

    // return a list of all movies
    exports.getActors = function (req, res) {
        logger.debug('Retrieving a list of all actors');
        db.getIndexedNodes('node_auto_index', 'type', 'actor',
                function (err, nodes) {
            if (err) {
                logger.error('Failed to load a list of all actors', err);
                return res.status(500).send();
            }

            // fallback in case no movies are stored in the database
            nodes = nodes || [];
                    
            // the attributes of the movie (like title, description) are stored inside 
            // the data-attribute, so we loop through all retrieved nodes and extract
            // the data-attribute
            var actors = nodes.map(function (node) {
                return node.data;
            });

            logger.debug('Successfully loaded %d actors.', actors.length);
            res.send(actors);
        });
    };

    exports.addActor = function (req, res) {
        var node = db.createNode(req.body);
        node.data.type = 'actor';
        node.data.id = uuid.v4();
        logger.debug('Adding a new actor');
        node.save(function (err, savedNode) {
            if (err) {
                logger.error('Failed to add actor: %s', err);
                return res.status(500).send();
            }

            logger.debug('Added new actor with id %s', savedNode.data.id);
            res.status(201)
                .location(getAbsoluteUriBase(req) +
                    '/actors/' + node.data.id)
                .send(savedNode.data);
        });
    };
    
    // return a single movie identified by url-parameter
    exports.getActor = function (req, res) {
        // extract the id from the request-object
        var id = req.params.id;
        logger.debug('Retrieving actor#%s from database.', id);

        // movies are indexed by id
        db.getIndexedNode('node_auto_index', 'id', id, function (err, node) {
            if (err) {
                logger.error('Failed to retrieve actor#%s: %s', id, err);
                return res.status(500).send();
            } else if (!node) {
                logger.debug('Actor#%s could not be found.', id);
                return res.status(404).send();
            }
            logger.debug('Found actor#%s with name: %s', id, node.data.name);
            res.send(node.data);
        });
    };

    exports.updateActor = function (req, res) {
        var id = req.params.id;
        db.getIndexedNode('node_auto_index', 'id', id, function (err, node) {
            if (err) {
                logger.error('Failed to retrieve actor#%s for update: %s',
                    id,
                    err);
                return res.status(500).send();
            } else if (!node) {
                logger.debug('Actor#%s could not be found for update.', id);
                return res.status(404).send();
            }
            node.data.name = req.body.name;
            node.data.biography = req.body.biography;
            
            node.save(function (err, savedNode) {
                if (err) {
                    logger.error('Failed to update actor#%s: %s', id, err);
                    return res.status(500).send();
                }

                logger.debug('Successfully updated actor#%s.', id);
                res.send(savedNode.data);
            });
        });
    };

    return exports;
};
