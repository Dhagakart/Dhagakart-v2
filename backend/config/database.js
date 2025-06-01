const mongoose = require('mongoose');
const MONGO_URI = "mongodb+srv://dsharpstechnology:ek51DYZg5p1isPQr@cluster0.q5ok6w4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const connectDatabase = () => {
    mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => {
            console.log("Mongoose Connected");
        });
}

module.exports = connectDatabase;