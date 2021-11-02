const mongoose = require('mongoose');

const UserProfile = new mongoose.Schema({
  username: {
    type: String,
    minlength: [3, 'username is too short'],
    maxlength: [20, 'username is too long']
  },
  image: {
    type: String,
    default: 'no-photo.jpg'
  },
  bio: {
    type: String,
    required: [true, 'Please tell us a bit of yourself'],
    maxlength: [500, 'Description can not be more than 500 characters']
  },
  skills: {
    type: [String],
    required: [true, 'Skill are required']
  },
  phone: {
    type: String,
    maxlength: [20, 'Phone number can not be longer than 20 characters']
  },
  website: {
    type: String
  },
  social: {
    youtube: {
      type: String
    },
    twitter: {
      type: String
    },
    facebook: {
      type: String
    },
    linkedin: {
      type: String
    },
    instagram: {
      type: String
    }
  },
  experience: [
    {
      title: {
        type: String,
        required: true
      },
      company: {
        type: String,
        required: true
      },
      location: {
        type: String
      },
      from: {
        type: Date,
        required: true
      },
      to: {
        type: Date
      },
      current: {
        type: Boolean,
        default: false
      },
      description: {
        type: String
      }
    }
  ],
  education: [
    {
      school: {
        type: String,
        required: true
      },
      degree: {
        type: String,
        required: true
      },
      fieldofstudy: {
        type: String,
        required: true
      },
      from: {
        type: Date,
        required: true
      },
      to: {
        type: Date
      },
      current: {
        type: Boolean,
        default: false
      },
      description: {
        type: String
      }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
})

module.exports = mongoose.model('Profile', UserProfile);