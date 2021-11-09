const Campground = require('../models/campground')


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
    const newCamp = new Campground(req.body.campground);
    newCamp.author = req.user._id;
    await newCamp.save();
    req.flash('success', 'Successfully made a new campground!');
    res.redirect('campgrounds');
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
    res.redirect(`/campgrounds/${camp._id}`);
}

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;

    const camp = await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground');

    res.redirect(`/campgrounds`);
}