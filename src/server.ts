import express from 'express';
import cors from 'cors';
import spvService from './services/spvService.ts';
import investorService from './services/investorService.ts';
import taxFormService from './services/taxFormService.ts';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// SPV Routes
app.get('/api/spvs', async (req, res) => {
  try {
    const result = await spvService.getAllSPVs();
    res.json(result);
  } catch (error) {
    console.error('Error in /api/spvs:', error);
    res.status(500).json({ error: 'Failed to fetch SPVs', status: 'error' });
  }
});


app.get('/api/spvs/:id', async (req, res) => {
  try {
    const spv = await spvService.getSPVById(req.params.id);
    res.json({ data: spv, status: 'success' });
  } catch (error) {
    res.status(404).json({ error: 'SPV not found', status: 'error' });
  }
});

app.post('/api/spvs', async (req, res) => {
  try {
    const newSpv = await spvService.createSPV(req.body);
    res.status(201).json({ data: newSpv, status: 'success' });
  } catch (error) {
    res.status(400).json({ error: 'Failed to create SPV', status: 'error' });
  }
});

app.put('/api/spvs/:id', async (req, res) => {
  try {
    const updatedSpv = await spvService.updateSPV(req.params.id, req.body);
    res.json({ data: updatedSpv, status: 'success' });
  } catch (error) {
    res.status(400).json({ error: 'Failed to update SPV', status: 'error' });
  }
});

app.delete('/api/spvs/:id', async (req, res) => {
  try {
    await spvService.deleteSPV(req.params.id);
    res.json({ status: 'success', message: 'SPV deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Failed to delete SPV', status: 'error' });
  }
});

// Investor Routes
app.get('/api/investors/spv/:spvId', async (req, res) => {
  try {
    const result = await investorService.getInvestorsBySPV(req.params.spvId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch investors', status: 'error' });
  }
});

app.get('/api/investors/:id', async (req, res) => {
  try {
    const investor = await investorService.getInvestorById(req.params.id);
    res.json({ data: investor, status: 'success' });
  } catch (error) {
    res.status(404).json({ error: 'Investor not found', status: 'error' });
  }
});

app.post('/api/investors', async (req, res) => {
  try {
    const newInvestor = await investorService.createInvestor(req.body);
    res.status(201).json({ data: newInvestor, status: 'success' });
  } catch (error) {
    res.status(400).json({ error: 'Failed to create investor', status: 'error' });
  }
});

// Tax Form Routes
app.get('/api/tax-forms/spv/:spvId', async (req, res) => {
  try {
    const result = await taxFormService.getTaxFormsBySPV(req.params.spvId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tax forms', status: 'error' });
  }
});

app.get('/api/tax-forms/investor/:investorId', async (req, res) => {
  try {
    const result = await taxFormService.getTaxFormsByInvestor(req.params.investorId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tax forms', status: 'error' });
  }
});

app.post('/api/tax-forms', async (req, res) => {
  try {
    const result = await taxFormService.createTaxForm(req.body);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create tax form', status: 'error' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API is available at http://localhost:${PORT}/api`);
});

export default app;