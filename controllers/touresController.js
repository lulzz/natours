const Tour = require('../models/touresModel');

exports.getAllTours = (req, res) => {
    res.status(200).json({
        status: 'success',
        data: {}
    });
};

exports.getTour = (req, res) => {
    res.json({
        status: 'success',
        requestTime: req.requestTime,
        data: {}
    });
};

exports.createTour = async (req, res) => {
    try {
        const newTour = await Tour.create(req.body);

        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: 'Invalid data sent!!!'
        });
    }
};

exports.updateTour = (req, res) => {
    res.status(201).json({
        status: 'success',
        data: {
            data: null
        }
    });
};

exports.deleteTour = (req, res) => {
    res.status(204).json({
        status: 'success',
        data: null
    });
};
