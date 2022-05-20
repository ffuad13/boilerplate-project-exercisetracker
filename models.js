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
	date: String
})

userSchema.virtual('exer', {
	ref: 'Exercise',
	localField: '_id',
	foreignField: 'User'
})

const User = mongoose.model("User", userSchema)
const Exercise = mongoose.model('Exercise', exerciseSchema)

module.exports = { User, Exercise }