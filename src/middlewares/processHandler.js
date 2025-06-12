'use strict'

// if the Promise is rejected this will catch it
const {exit} = require("./index");

process.on('SIGINT', () => {
    console.log('Ctrl + C:: Service stop!!!')
    exit()
});

// CTRL+C
process.on('SIGQUIT', () => {
    console.log('Keyboard quit:: Service stop!!!')
    exit()
});
// Keyboard quit
process.on('SIGTERM', () => {
    console.log('Kill command:: Service stop!!!')
    exit()
});
// `kill` command

// catch all uncaught exceptions
process.on('unhandledRejection', error => {
    console.error(error)
    throw error
})

process.on('uncaughtException', error => {
    console.error(error)
	throw error
})

module.exports = this