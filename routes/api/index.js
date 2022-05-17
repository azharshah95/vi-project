const express = require('express')
const router = express.Router()

const Url = require('../../models/Url')

// @route   GET api/:urlCode
// @desc    fetch & redirect shortened url
// @access  Public
router.get('/:urlCode', async (req, res) => {
  try {
    const { urlCode } = req.params

    const url = await Url.findOne({ urlCode })

    if (url) {

      url.hits++  // increment access hits

      await url.save()

      return res.redirect(url.originalUrl)
    } else {
      return res.status(404).send('Url Not Found')
    }
  } catch (error) {
    console.log(error);
    res.status(500).send('Server Error')
  }
})

module.exports = router
