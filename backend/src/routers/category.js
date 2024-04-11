import { Router } from 'express';
import {
    deleteCategoryById,
    getAll,
    getCategoryById,
    updateCategoryById,
    create
} from '../controllers/category';

const router = Router();

router.get('/categories', getAll);
router.get('/categories/:id', getCategoryById);
router.delete('/categories/:id', deleteCategoryById);
router.put('/categories/:id', updateCategoryById);
router.post('/categories', create);


export default router;

