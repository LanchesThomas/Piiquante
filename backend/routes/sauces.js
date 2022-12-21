const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const saucesCtrl = require('../controllers/sauces');
const multer = require('../middleware/multer-config');
// route get all sauces
router.get('/', auth, saucesCtrl.Sauces);
// route get one sauce
router.get('/:id', auth, saucesCtrl.oneSauce);
// route add sauce
router.post('/', auth, multer, saucesCtrl.addSauce);
// route modify sauce
router.put('/:id', auth, multer, saucesCtrl.updateSauce);
// route delete sauce
router.delete('/:id', auth, saucesCtrl.deleteSauce);
// route like/dislike sauce
router.post('/:id/like', auth, saucesCtrl.likeSauce);

module.exports = router;
