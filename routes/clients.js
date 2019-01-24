const express = require('express')
const router = express.Router()

router.get("/", function(req, res) {

    res.send({clients:[{
        id: 1,
        firmanavn: "Astrojo",
        kontaktperson: "Kriss",
        sistendret: "dato"
    },
    {
        id: 2,
        firmanavn: "Uberill",
        kontaktperson: "Jan",
        sistendret: "dato"
    },
    {
        id: 3,
        firmanavn: "Ealium",
        kontaktperson: "Joakim",
        sistendret: "dato"
    },
    {
        id: 4,
        firmanavn: "Tavu",
        kontaktperson: "Sofie",
        sistendret: "dato"
    },
    {
        id: 5,
        firmanavn: "Pyromba",
        kontaktperson: "Karen",
        sistendret: "dato"
    },
    {
        id: 6,
        firmanavn: "Skazz",
        kontaktperson: "Ole",
        sistendret: "dato"
    },
    {
        id: 7,
        firmanavn: "Mistijo",
        kontaktperson: "Emma",
        sistendret: "dato"
    },
    {
        id: 8,
        firmanavn: "Misose",
        kontaktperson: "Petter",
        sistendret: "dato"
    },
    {
        id: 9,
        firmanavn: "Coravu",
        kontaktperson: "Emil",
        sistendret: "dato"
    },
    {
        id: 10,
        firmanavn: "Hemitude",
        kontaktperson: "Mattis",
        sistendret: "dato"
    },
    {
        id: 11,
        firmanavn: "Quicee",
        kontaktperson: "Siren",
        sistendret: "dato"
    },
    {
        id: 12,
        firmanavn: "Anous",
        kontaktperson: "Simon",
        sistendret: "dato"
    },
    {
        id: 13,
        firmanavn: "Diser",
        kontaktperson: "Erna",
        sistendret: "dato"
    },
    {
        id: 14,
        firmanavn: "Maxinti",
        kontaktperson: "Fredrik",
        sistendret: "dato"
    },
    {
        id: 15,
        firmanavn: "Enist",
        kontaktperson: "Arne",
        sistendret: "dato"
    }]})

})   
  
module.exports = router

    