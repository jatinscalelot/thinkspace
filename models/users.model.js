let mongoose = require("mongoose");
let mongoosePaginate = require("mongoose-paginate-v2");
let schema = new mongoose.Schema({
	fullname : {
		type: String,
		default: ''
	},
	firstname : {
		type: String,
		default: ''
	},
	lastname : {
		type: String,
		default: ''
	},
	mobilenumber : {
		type: String,
		default: ''
	},
	email: {
		type: String,
		require: true
	},
	password: {
		type: String,
		default: ''
	}
}, { timestamps: true, strict: false, autoIndex: true });
schema.plugin(mongoosePaginate);
module.exports = schema;