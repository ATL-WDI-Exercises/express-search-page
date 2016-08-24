var mongoose = require('mongoose');

var MovieSchema = new mongoose.Schema({
  title:  { type: String, required: true },
  genre:  { type: String, required: true },
  year:   { type: Number, required: true }
  },
  { timestamps: true }  // createdAt, updatedAt
);

function date2String(date) {
  var options = {
    weekday: 'long', year: 'numeric', month: 'short',
    day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit'
  };
  return date.toLocaleDateString('en-US', options);
}

MovieSchema.methods.getCreatedAt = function() {
  return date2String(this.createdAt);
};

MovieSchema.methods.getUpdatedAt = function() {
  return date2String(this.updatedAt);
};

module.exports = mongoose.model('Movie', MovieSchema);
