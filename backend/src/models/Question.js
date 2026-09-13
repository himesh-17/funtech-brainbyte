const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
  {
    questionText: {
      type: String,
      required: [true, 'Question text is required'],
      trim: true,
    },
    options: [
      {
        key: {
          type: String,
          required: true,
          trim: true,
        },
        text: {
          type: String,
          required: true,
          trim: true,
        },
        _id: false,
      },
    ],
    correctOptionKey: {
      type: String,
      required: [true, 'Correct option key is required'],
      trim: true,
    },
    marks: {
      type: Number,
      default: 1,
      min: [0, 'Marks cannot be negative'],
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Index on order for sorted retrieval
questionSchema.index({ order: 1 });

// Instance method: returns question WITHOUT the correct answer (for client)
questionSchema.methods.toClientJSON = function () {
  return {
    _id: this._id,
    questionText: this.questionText,
    options: this.options, // key + text only, no correctOptionKey
    marks: this.marks,
    order: this.order,
  };
};

module.exports = mongoose.model('Question', questionSchema);
