const fs = require('fs');

const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

exports.checkBody = (req, res, next) => {
    console.log('im HERE111');
    if (!req.body.name || !req.body.price) {
        return res.status(400).json({
            status: 'fail',
            message: 'Missing name or price'
        });
    }

    console.log(`Price is ${req.body.price}`);
    console.log(`Name is ${req.body.name}`);
    next();
};

exports.checkID = (req, res, next, val) => {
    if (req.params.id * 1 > tours.length) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        });
    }
    next();
};

exports.getAllTours = (req, res) => {
    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
            tours
        }
    });
};

exports.getTour = (req, res) => {
    const id = req.params.id * 1;
    const tour = tours.find(item => item.id === id);

    res.json({
        status: 'success',
        requestTime: req.requestTime,
        data: {
            tour
        }
    });
};

exports.createTour = (req, res) => {
    const newId = tours[tours.length - 1].id + 1;
    const newTour = Object.assign({ id: newId }, req.body);

    tours.push(newTour);

    fs.writeFile(
        `${__dirname}/dev-data/data/tours-simple.json`,
        JSON.stringify(tours),
        err => {
            res.status(201).json({
                status: 'success',
                data: {
                    tour: newTour
                }
            });
        }
    );
};
exports.updateTour = (req, res) => {
    const tourIndex = tours.findIndex(item => item.id === id);

    const updatedTour = {
        ...tour,
        ...req.body
    };

    // update db
    tours.splice(tourIndex, 1, updatedTour);

    fs.writeFile(
        `${__dirname}/dev-data/data/tours-simple.json`,
        JSON.stringify(tours),
        err =>
            res.status(201).json({
                status: 'success',
                data: {
                    updatedTour
                }
            })
    );
};

exports.deleteTour = (req, res) => {
    const tourIndex = tours.findIndex(item => item.id === id);

    // update db
    tours.splice(tourIndex, 1);

    fs.writeFile(
        `${__dirname}/dev-data/data/tours-simple.json`,
        JSON.stringify(tours),
        err =>
            res.status(204).json({
                status: 'success',
                data: null
            })
    );
};
