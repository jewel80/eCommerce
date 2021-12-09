const Mongoose = require('mongoose');



const productSchema = new Mongoose.Schema({
    name: {
        type: String,
        required: [true, 'please enter product name'],
        trim: true,
        maxLength: [100, 'prodcut name cannnot exceed 100 charcters']
    },
    price: {
        type: Number,
        required: [true, 'please enter product price'],
        trim: true,
        maxLength: [5, 'prodcut price cannnot exceed 5 charcters'],
        default: 0.0
    },
    description: {
        type: String,
        required: [true, 'please enter product description']
    },
    ratings: {
        type: Number,
        default: 0
    },
    images: [{
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    }],
    category: {
        type: String,
        required: [true, 'please enter product category'],
        enum: {
            values: [
                'Electronic',
                'Cameras',
                'Laptop',
                'Accessoris',
                'Headphone',
                'Food',
                'Clothe/Shoes',
                'Beauty/Health',
                'Sports',
                'outdoor',
                'Home'
            ],
            message: 'please select category for product'
        }
    },
    seller: {
        type: String,
        required: [true, 'please enter product seller']
    },
    stock: {
        type: Number,
        required: [true, 'please enter product stock'],
        maxLength: [5, 'prodcut name cannnot exceed 5 charcters'],
        default: 0
    },
    numberOfReviews: {
        type: Number,
        default: 0
    },
    reviews: [{
        name: {
            type: String,
            required: true
        },
        rating: {
            type: String,
            required: true
        },
        comment: {
            type: String,
            required: true
        },
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
})



module.exports = Mongoose.model('product', productSchema);