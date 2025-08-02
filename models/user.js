

const mongoose = require('mongoose');

// Connect without deprecated options 
//mongodb://127.0.0.1:27017/vision_class
mongoose.connect("mongodb+srv://aashishbirhade:8530970516@cluster0.1usbk5t.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");

const gameResultSchema = new mongoose.Schema({
  gameName: { type: String, required: true },
  score: { type: Number, required: true },
  completionTime: { type: Number, required: true }, // in seconds
  totalQuestions: { type: Number, required: true },
  accuracy: { type: Number }, // percentage
  date: { type: Date, default: Date.now }
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { 
    type: String, 
    required: true, 
    unique: true, // this already creates a unique index
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  phoneNo: { 
    type: String, 
    required: true,
    validate: {
      validator: function(v) {
        return /\d{10}/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  },
  class: { 
    type: String, 
    enum: ['XI', 'XII'], 
    required: true 
  },
  password: { 
    type: String, 
    required: true,
    minlength: 6
  },
  role: { 
    type: String, 
    enum: ['student', 'faculty'], 
    default: 'student' 
  },
  gameResults: [gameResultSchema],
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Keep only one index (we're keeping createdAt for sorting)
userSchema.index({ createdAt: -1 });

module.exports = mongoose.model("User", userSchema);
