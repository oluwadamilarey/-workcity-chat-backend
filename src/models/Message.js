const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true,
    index: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: function() {
      return !this.attachments || this.attachments.length === 0;
    },
    maxlength: 1000
  },
  type: {
    type: String,
    enum: ['text', 'file', 'image', 'product', 'system'],
    default: 'text'
  },
  attachments: [{
    url: String,
    publicId: String, // Cloudinary public ID
    name: String,
    size: Number,
    mimeType: String,
    thumbnailUrl: String
  }],
  productContext: {
    productId: String,
    productName: String,
    productUrl: String,
    productImage: String,
    productPrice: Number
  },
  replyTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  },
  readBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    readAt: {
      type: Date,
      default: Date.now
    }
  }],
  editedAt: Date,
  deletedAt: Date,
  deletedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexes for performance
messageSchema.index({ conversationId: 1, createdAt: -1 });
messageSchema.index({ sender: 1 });
messageSchema.index({ 'readBy.user': 1 });

module.exports = mongoose.model('Message', messageSchema);