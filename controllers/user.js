/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const asyncHandler = require('../middlewares/async');
// eslint-disable-next-line no-unused-vars
const ErrorResponse = require('../utils/errResponse');
const Profile = require('../models/Profile');
const normalize = require('normalize-url');
const User = require('../models/User')


// @desc      Get single user
// @route     GET /api/v1/users/:id
// @access    private
exports.getUsers = asyncHandler(async (req, res, next) => {
  const users = await Profile.find().populate('user')

  // if (!user) {
  //   return next(
  //     new ErrorResponse(`User not found with id of ${req.params.id}`, 404)
  //   );
  // }
  res.status(200).json({ success: true, count: users.length, users });
});

// @desc      Get single user
// @route     GET /api/v1/users/profile/:user_id
// @access    public // admin
exports.getProfile = asyncHandler(async (req, res, next) => {
  const user = await Profile.findOne({user:req.params.user_id}).populate('user');

  if (!user) {
    return next(
      new ErrorResponse(`User not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({ success: true, user });
});


// @desc      Get single user
// @route     GET /api/v1/users/account
// @access    private
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await Profile.findOne({user:req.user.id}).populate('user');

  if (!user) {
    return next(
      new ErrorResponse(`User not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({ success: true, user });
});


// @desc      Create profile or update
// @route     POST /api/v1/users/profile
// @access    Private
exports.createprofile = asyncHandler(async(req, res, next) => {
  // destructure the request
  const {
    username,
    skills,
    image,
    bio,
    phone,
    facebook,
    twitter,
    instagram,
    linkedin,
    website,
    youtube,
    // spread the rest of the fields we don't need to check
    ...rest
  } = req.body;

  if (!skills) {
    return next(
      new ErrorResponse('Is skills are required', 400)
    )
  }

  // build profile objects
  const profileFields = {
    user: req.user.id,
    website:
      website && website !== ''
        ? normalize(website, { forceHttps: true })
        : '',
    skills: Array.isArray(skills)
      ? skills
      : skills.split(',').map((skill) => ' ' + skill.trim()),
    ...rest
  }
  if(image) profileFields.image = image;
  if(username) profileFields.username = username;
  if(phone) profileFields.phone = phone;
  if(bio) profileFields.bio = bio;

  profileFields.social = {}

  if(facebook) profileFields.social.facebook = facebook;
  if(twitter) profileFields.social.twitter = twitter;
  if(instagram) profileFields.social.instagram = instagram;
  if(linkedin) profileFields.social.linkedin = linkedin;
  if(youtube) profileFields.social.youtube = youtube;

  let profile = await Profile.findOne({user: req.user.id});

  if(profile) {
    console.log('amosmoyo')

    profile = await Profile.findOneAndUpdate({user:req.user.id}, {$set: profileFields}, {new: true})

    return res.status(200).json({
      success: true,
      profile
    })
  }

  profile = new Profile(profileFields);

  await profile.save();

  res.status(200).json({
    success: true,
    profile
  })

});

// @desc      Delete user account
// @route     PUT /api/v1/profile/account
// @access    Private
exports.deleteAccount = asyncHandler(async (req, res, next) => {
  await Profile.findOneAndRemove({user:req.user.id });

  await User.findByIdAndRemove({_id: req.user.id})

  res.status(200).json({ success: true, message: 'Account has been deleted' });
});

// @route    PUT api/v1/users/profile/experience
// @desc     Add profile experience
// @access   Private
exports.addExpirience =  asyncHandler (async (req, res, next) => {

  const { title, company, location, from, to, current, description } = req.body;

  if (!title) {
    return next(
      new ErrorResponse('title is required', 400)
    )
  }

  if (!company) {
    return next(
      new ErrorResponse('company is required', 400)
    )
  }

  const profile = await Profile.findOne({ user: req.user.id });

  profile.experience.unshift({title, company, location, from, to, current, description});

  await profile.save();

  res.status(200).json({
    success:true,
    profile
  });
})

// @route    DELETE api/profile/experience/:exp_id
// @desc     Delete experience from profile
// @access   Private
exports.deleteExperience = asyncHandler(async (req, res, next) => {
  const foundProfile = await Profile.findOne({ user: req.user.id });

  if (!foundProfile) {
    return next(
      new ErrorResponse(`Profile with id ${req.user.id} not found`, 404)
    )
  }

  foundProfile.experience = foundProfile.experience.filter(
    (exp) => exp._id.toString() !== req.params.exp_id
  );

  await foundProfile.save();
  return res.status(200).json({success: true, foundProfile});
});

// // @route    PUT api/profile/education
// // @desc     Add profile education
// // @access   Private
// router.put(
//   '/education',
//   async (req, res, next) => {

//     check('school', 'School is required').notEmpty(),
//     check('degree', 'Degree is required').notEmpty(),
//     check('fieldofstudy', 'Field of study is required').notEmpty(),
//     check('from', 'From date is required and needs to be from the past')
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     try {
//       const profile = await Profile.findOne({ user: req.user.id });

//       profile.education.unshift(req.body);

//       await profile.save();

//       res.json(profile);
//     } catch (err) {
//       console.error(err.message);
//       res.status(500).send('Server Error');
//     }
//   }
// );