import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config(); 

const app = express();
const PORT = process.env.PORT || 5000;
// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
.then(() => {
    console.log('MongoDB connected successfully');
})
.catch(err => {
    console.error('MongoDB connection error:', err);
});

// Define a Schema and Model
const websiteSchema = new mongoose.Schema({
    id: {
        type: String,
        unique: true,
        required: true
    },
    commonSecClass: String,
    heading_class: String,
    ulClass: String,
    btnClasses: String,
    imgBox: String,
    rowClass: String,
    imgCol: String,
    contCol: String,
});

const Website = mongoose.model('Website', websiteSchema);

// Routes
// Add website data
app.post('/website', async (req, res) => {
    const websiteData = req.body;
    
    try {
        const website = await Website.findOne({ id: websiteData.id });
        if (website) {
            return res.status(409);
        }
        const newWebsite = new Website(websiteData);
        await newWebsite.save();
       return res.status(200);
    } catch (error) {
        res.status(500).json({ message: 'Error adding website data!' });
    }
});

app.get('/website', async (req, res) => {
    try {
        const websites = await Website.find(); 
       return res.json(websites); 
    } catch (error) {
       return res.status(500).json({ message: 'Error fetching website data!' });
    }
});

// Get all website data
app.get('/website/:id', async (req, res) => {
    const websiteId = req.params.id;

    try {
        const website = await Website.findOne({ id: websiteId });

        if (!website) {
            return res.status(404).json({ message: 'Website not found!' });
        }

        res.json(website); 
    } catch (error) {
       return res.status(500).json({ message: 'Error fetching website data!' });
    }
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
