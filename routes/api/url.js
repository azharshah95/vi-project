const express = require('express')
const router = express.Router()
const validUrl = require('valid-url')
const shortid = require('shortid')
const passport = require('passport')
const mongoose = require('mongoose')

const Url = require('../../models/Url')

const { checkRole } = require('../../config/Auth');


// @route   POST api/url/short
// @desc    URL Shortner
// @access  Public
router.post('/short', async (req, res) => {
  const { originalUrl } = req.body
  const baseUrlApi = process.env.BASE_URL_API

  // validate baseurlapi
  if (!validUrl.isHttpUri(baseUrlApi)) {
    return res.status(422).json('Invalid baseurlapi')
  }

  // generate shortcode
  const urlCode = shortid.generate()

  // validate originalurl and then process it
  if (validUrl.isHttpUri(originalUrl) || validUrl.isHttpsUri(originalUrl)) {
    try {

      let url = await Url.findOne({ originalUrl })

      if (url) {
        url.requests++  // how often it was shortened
        await url.save()
        res.json(url.shortUrl)
      } else {
        const shortUrl = baseUrlApi + '/' + urlCode   // concatenate baseurl and urlcode

        //  save url in db
        url = new Url({
          originalUrl,
          shortUrl,
          urlCode,
          date: new Date()
        })

        await url.save()

        res.json(url.shortUrl)
      }
    } catch (error) {
      console.log(error);
      res.status(500).json('Server Error')
    }
  } else {
    res.status(422).json('Invalid original URL')
  }
})


// @route   POST api/url/privateshort
// @desc    URL Shortner for logged in Users
// @access  Private
router.post('/privateshort',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const { originalUrl } = req.body
    const { id } = req.user
    const baseUrlApi = process.env.BASE_URL_API

    // validate baseurlapi
    if (!validUrl.isHttpUri(baseUrlApi)) {
      return res.status(422).json('Invalid baseurlapi')
    }

    // generate shortcode
    const urlCode = shortid.generate()

    // validate originalurl and then process it
    if (validUrl.isHttpUri(originalUrl) || validUrl.isHttpsUri(originalUrl)) {
      try {

        let url = await Url.findOne({ user: id, originalUrl })

        if (url) {
          url.requests++  // how often it was shortened
          await url.save()
          res.json(url)
        } else {
          const shortUrl = baseUrlApi + '/' + urlCode   // concatenate baseurl and urlcode

          //  save url in db
          url = new Url({
            user: id,
            originalUrl,
            shortUrl,
            urlCode,
            date: new Date()
          })

          await url.save()

          res.json(url)
        }
      } catch (error) {
        console.log(error);
        res.status(500).json('Server Error')
      }
    } else {
      res.status(422).json('Invalid original URL')
    }
  })

// @route   GET api/url/
// @desc    fetch all url for admin and users
// @access  Private
router.get('/',
  passport.authenticate('jwt', { session: false }),
  checkRole(["admin", "user"]),
  async (req, res) => {
    try {
      if (req.user.role === "admin") {
        var url = await Url.find({})  // admin can access all URLs
      } else {
        const { id } = req.user
        var url = await Url.find({ user: id })  // list of URLs for particular user
      }

      if (url.length == 0) {
        res.status(404).json('No url in the list')
      } else {
        res.json(url)
      }
    } catch (error) {
      console.log(error);
      res.status(500).send('Server error');
    }
  })


module.exports = router