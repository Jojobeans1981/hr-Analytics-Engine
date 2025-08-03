import { Router } from 'express';
import { ObjectId } from 'mongodb';
import { createAssessmentSchema, updateAssessmentSchema } from './../validations/assessment.validation';
import { handleError } from './../utils/errorHandler';


const router = Router();

// Create new assessment
router.post('/', async (req, res) => {
  try {
    const { error } = createAssessmentSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { db } = req.app.locals;
    const assessment = {
      ...req.body,
      employeeId: new ObjectId(req.body.employeeId),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('assessments').insertOne(assessment);
    res.status(201).json(result);
  }catch (error: unknown) {
  const { status, message } = handleError(error);
  res.status(status).json({ error: message });
}
});

// Get all assessments
router.get('/', async (req, res) => {
  try {
    const { db } = req.app.locals;
    const assessments = await db.collection('assessments')
      .find()
      .sort({ createdAt: -1 })
      .toArray();
    res.json(assessments);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: errorMessage });
  }
});

// Get assessment by ID
router.get('/:id', async (req, res) => {
  try {
    const { db } = req.app.locals;
    const assessment = await db.collection('assessments').findOne({
      _id: new ObjectId(req.params.id)
    });

    if (!assessment) {
      return res.status(404).json({ error: "Assessment not found" });
    }

    res.json(assessment);
  } catch (error: unknown) {
  const { status, message } = handleError(error);
  res.status(status).json({ error: message });
}
});

// Update assessment
router.put('/:id', async (req, res) => {
  try {
    const { error } = updateAssessmentSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { db } = req.app.locals;
    const result = await db.collection('assessments').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { ...req.body, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Assessment not found" });
    }

    res.json(result);
  } catch (error: unknown) {
  const { status, message } = handleError(error);
  res.status(status).json({ error: message });
}
});

export default router;