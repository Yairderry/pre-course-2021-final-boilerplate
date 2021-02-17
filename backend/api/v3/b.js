const express = require('express');
const fs = require('fs');
const router = express.Router();
router.use(express.json());

let userBins = [];
fs.readdirSync('./backend/bins').forEach(file => {
    const bin = JSON.parse(fs.readFileSync(`./backend/bins/${file}`, { encoding:'utf8', flag:'r' }));
    const id = file.replace('.JSON', '');
    const binData = {bin, id};
    userBins.push(binData);
});

router.get('/', (req, res) => {
    res.send({ "record": userBins });
});

router.get('/:id', (req, res) => {
    const id = req.params.id;
    const data = fs.readFileSync(`./backend/bins/${id}.JSON`, 
            {encoding:'utf8', flag:'r'});
    res.send({ "record": JSON.parse(data), "metadata": { "id": id }});
});

router.post('/',(req, res) => {
    const bin = req.body;
    const id = new Date().getTime();
    userBins.push({ bin, id });
    fs.writeFileSync(`./backend/bins/${id}.JSON`, JSON.stringify(bin));
    res.send({ "record": bin, "metadata": { "id": id }});
});

router.put('/:id',(req, res) => {
    const id = req.params.id;
    for(let i = 0; i < userBins.length; i++) {
        if(userBins[i].id === id) {
            userBins[i].bin = req.body;
            fs.writeFileSync(`./backend/bins/${id}.JSON`, JSON.stringify(req.body));
            res.send({ "record": req.body, "metadata": { "id": id }});
        }
    }
});

router.delete('/:id',(req, res) => {
    const id = req.params.id;
    for(let i = 0; i < userBins.length; i++) {
        if(userBins[i].id === id) {
            fs.unlinkSync(`./backend/bins/${userBins[i].id}.JSON`);
            userBins.splice(i, 1);
            res.send({ "message": "Bin deleted successfully" });
        }
    }
});

module.exports = router;