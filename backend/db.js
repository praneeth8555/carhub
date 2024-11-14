const mongoose = require('mongoose');
mongoose.set("strictQuery", true);

const MongoDB = async () => {
    try {
        await mongoose.connect(process.env.mongouri, { useNewUrlParser: true });
        console.log("Connected to MongoDB");
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
    }
};

module.exports = MongoDB;
