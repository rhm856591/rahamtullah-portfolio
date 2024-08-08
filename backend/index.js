const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const sendEmail = require('./utility'); // Import the utility function
const app = express();
require('dotenv').config();


app.use(cors());
app.use(express.json()); // To parse JSON bodies
app.use(express.urlencoded({ extended: true })); // To parse URL-encoded bodies


// Connect to MongoDB
const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Failed to connect to MongoDB', error);
    }
};

// Call the connect function to establish the connection
connect();

// Mongoose schema
const schema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String, // Changed to String to accommodate different phone formats
        required: true
    },
    message: {
        type: String,
        required: true
    }
});

// Mongoose model
const Message = mongoose.model('Message', schema);

// Route to create a new message and send emails
app.post('/', async (req, res) => {
    const newMessage = new Message(req.body);
    try {
        await newMessage.save();

        // Send emails
        await sendEmail(req.body.email, req.body.fullname, req.body.phone, req.body.message);

        res.json({
            message: 'Message created successfully and emails sent'
        });
    } catch (error) {
        if (error.code === 11000) { // Duplicate key error
            res.status(400).json({
                message: 'Email already exists'
            });
        } else {
            res.status(500).json({
                message: 'Failed to create message',
                error: error.message
            });
        }
    }
});


// Route to get hello world
app.get('/', (req, res) => res.send('Hello World!'));

// Start the server
app.listen(3000, () => console.log('Server running on port 3000...'));
