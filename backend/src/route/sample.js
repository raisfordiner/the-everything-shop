const router = require("express").Router();

/**
 * @swagger
 * /sample:
 *   get:
 *     summary: Returns a sample message
 *     responses:
 *       200:
 *         description: A successful response
 */

router.get('/', (req, res) => {
    res.json({ message: 'This is a sample message' });
});

module.exports = router;