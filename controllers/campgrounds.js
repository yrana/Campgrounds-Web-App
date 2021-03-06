const Campground = require('../models/campground')
const { cloudinary } = require('../cloudinary');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken })

module.exports.index = async (req, res) => {
    const camps = await Campground.find({});
    res.render('campgrounds/index', { camps });
}


module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new');
}


module.exports.createCampground = async (req, res, next) => {
    // if (!req.body.campground) throw new ExpressError('Invalid Campground data', 400);
    // TODO something is generating an error in POST request from postman tool here 
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
    const newCamp = new Campground(req.body.campground);
    newCamp.geometry = geoData.body.features[0].geometry; // GeoJSON format
    newCamp.images = req.files.map(f => ({ url: f.path, filename: f.filename }))
    newCamp.author = req.user._id;
    await newCamp.save();
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`campgrounds/${newCamp._id}`);
}

module.exports.showCampground = async (req, res) => {
    const { id } = req.params;
    const campSelected = await Campground.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');

    if (!campSelected) {
        req.flash('error', 'Cannot find that campground');
        res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campSelected });
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const campSelected = await Campground.findById(id);
    if (!campSelected) {
        req.flash('error', 'Cannot find that campground');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campSelected });
}

module.exports.updateCampground = async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findByIdAndUpdate(id, req.body.campground, { runValidators: true, new: true });
    const images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    camp.images.push(...images);
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await camp.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    await camp.save();
    res.redirect(`/campgrounds/${camp._id}`);
}

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;

    const camp = await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground');

    res.redirect(`/campgrounds`);
}