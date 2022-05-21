const mongoose = require('mongoose')

require('dotenv').config()
mongoose.connect(process.env.MONGO_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
})

const userSchema = mongoose.Schema({
	username: {
		type: String,
		required: true,
		unique: true
	}
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

const exerciseSchema = mongoose.Schema({
	user_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	description: String,
	duration: Number,
	date: Date
})

userSchema.virtual('exer', {
	ref: 'Exercise',
	localField: '_id',
	foreignField: 'user_id',
})

const User = mongoose.model("User", userSchema, "User")
const Exercise = mongoose.model("Exercise", exerciseSchema, "Exercise")

module.exports = { User, Exercise }