const express = require('express')
const router = express.Router()

router.get("/", function(req, res) {

    res.send({files:[{
        id: 1,
        tittel: "Paladin's Mask",
        type: "PDF",
        sistendret: "dato"
    },
    {
        id: 2,
        tittel: "Dressed for Death",
        type: "WORD",
        sistendret: "dato"
    },
    {
        id: 3,
        tittel: "The Grey Marigold",
        type: "PDF",
        sistendret: "dato"
    },
    {
        id: 4,
        tittel: "Unseen Instinct",
        type: "EXCEL",
        sistendret: "dato"
    },
    {
        id: 5,
        tittel: "Purple Duty",
        type: "WORD",
        sistendret: "dato"
    },
    {
        id: 6,
        tittel: "Heart of Moss",
        type: "PDF",
        sistendret: "dato"
    },
    {
        id: 7,
        tittel: "Thief of Slaughter",
        type: "TXT",
        sistendret: "dato"
    },
    {
        id: 8,
        tittel: "Queen of Polaris",
        type: "WORD",
        sistendret: "dato"
    },
    {
        id: 9,
        tittel: "Hello, Goodbye",
        type: "WORD",
        sistendret: "dato"
    },
    {
        id: 10,
        tittel: "Midnight Rose",
        type: "TXT",
        sistendret: "dato"
    },
    {
        id: 11,
        tittel: "Dark Good Looks",
        type: "PDF",
        sistendret: "dato"
    },
    {
        id: 12,
        tittel: "The Fall of Dawn",
        type: "PDF",
        sistendret: "dato"
    },
    {
        id: 13,
        tittel: "Xeno Crown",
        type: "EXCEL",
        sistendret: "dato"
    },
    {
        id: 14,
        tittel: "To Capture a Ring",
        type: "WORD",
        sistendret: "dato"
    },
    {
        id: 15,
        tittel: "City of Fury",
        type: "PDF",
        sistendret: "dato"
    }]})

})   
  
module.exports = router

    