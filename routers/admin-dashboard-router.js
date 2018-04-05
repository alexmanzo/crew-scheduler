const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')


router.get('/admin-dashboard', (req, res => {
	window.load = 'admin-dashboard.html'
})