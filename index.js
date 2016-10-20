var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var app = express();
app.use(bodyParser.json());



/**************************** 
 *      BASE DE DATOS       *
 ****************************
*/

mongoose.connect('mongodb://localhost/penguin-api');



/**************************** 
 *          MODELO          *
 ****************************
*/

var penguinSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    tipo: String,
});

var Penguin = mongoose.model('Penguin', penguinSchema);



/**************************** 
 *        ENDPOINTS         *
 ****************************
*/

// Obtiene todos los pinguinos
app.get('/penguins', function(req, res) {
    Penguin.find({}, function(error, penguin) {
        if (error) return res.status(500).send(error);
        
       res.json(penguin);
    }); 
});


// Obtiene un pinguino
app.get('/penguins/:id', function(req, res) {
    Penguin.findById(req.params.id, function(error, penguin) {
        if (error) return res.status(500).send(error);
        
       res.json(penguin);
    }); 
});

// Crea un pinguino nuevo
app.post('/penguins', function(req, res) {
    var penguin = new Penguin();
    penguin.nombre = req.body.nombre;
    penguin.tipo = req.body.tipo || 'No especificado';

    penguin.save(function(error, savedPenguin) {
        if (error) return res.status(500).send(error);

        res.status(201).json(savedPenguin);
    });
});

// Actualiza un pinguino
app.put('/penguins/:id', function(req, res) {
    Penguin.findById(req.params.id, function(error, penguin) {
        if (error) return res.status(500).send(error);
    
        penguin.nombre = req.body.nombre;
        penguin.tipo = req.body.tipo || 'No especificado';

        penguin.save(function(savingError, savedPenguin) {
            if (savingError) return res.status(500).send(savingError);

            res.json(savedPenguin);
        });
    }); 
});

// Borra un pinguino
app.delete('/penguins/:id', function(req, res) {
    Penguin.findById(req.params.id, function(error, penguin) {
        if (error) return res.status(500).send(error);
    
        penguin.remove(function(removingError) {
            if (removingError) return res.status(500).send({ error: removingError });

           res.json({ message: "Pingüino removido exitosamente" });
        });
    }); 
});



/**************************** 
 *  COMIENZA LA APLICACION  *
 ****************************
*/

app.listen(3000, function() {
    console.log('Escuchando en el puerto 3000');
});