import express from 'express';
import { getAllIntercambios, getIntercambioById, createIntercambio, updateIntercambio, deleteIntercambio } from '../controllers/intercambiosController.js';

const router = express.Router();

router.get('/', getAllIntercambios);
router.get('/:id', getIntercambioById);
router.post('/', createIntercambio);
router.put('/:id', updateIntercambio);
router.delete('/:id', deleteIntercambio);

export default router;