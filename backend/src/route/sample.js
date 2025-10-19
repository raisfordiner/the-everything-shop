const router = require("express").Router();
const { PrismaClient } = require("../../generated/prisma")

const prisma = new PrismaClient()

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

// Yo, i don't know how to use Swagger and is too lazy to search it up
// This is for testing prisma only, no other purpose
router.get('/user', async (req, res) => {
    const userCount = await prisma.user.count();
    res.json(
        userCount !== 0
        ? "Maybe some users found"
        : "No users found, say zero"
    );
});

// Also, this is for testing
router.get('/user/:id', async (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid user ID' });
    }
    const user = await prisma.user.findUnique({
        where: { id },
    });
    if (user) {
        res.json(user);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

module.exports = router;
