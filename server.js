const express = require("express");
const app = express();

app.use(express.static("./public"));

app.listen(3000, function(){
    console.log("Server is listening on port 3000");
});

app.get("/", function(req, res){
    res.sendFile(__dirname + "/public/index.html");
})

app.post('/submit', (req, res) => {
    const formData = req.body;
    console.log(formData);
    res.send('Form submitted successfully!');
});
