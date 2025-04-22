Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone https://github.com/whysorush/tax-system.git

# Step 2: Navigate to the project directory.
cd tax-system

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
Frontend
npm run dev


Backend: 
npm run dev:server

1. SPV Endpoints:

# Get all SPVs
curl -X GET http://localhost:3001/api/spvs

# Get SPV by ID
curl -X GET http://localhost:3001/api/spvs/{spvId}

# Create new SPV
curl -X POST http://localhost:3001/api/spvs \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test SPV 2024",
    "entityTaxId": "123456789",
    "taxYear": 2024
  }'

# Update SPV
curl -X PUT http://localhost:3001/api/spvs/{spvId} \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated SPV Name",
    "entityTaxId": "987654321",
    "taxYear": 2024
  }'

# Delete SPV
curl -X DELETE http://localhost:3001/api/spvs/{spvId}


2. Investor Endpoints:

# Get investors by SPV
curl -X GET http://localhost:3001/api/investors/spv/{spvId}

# Get investor by ID
curl -X GET http://localhost:3001/api/investors/{investorId}

# Create new investor
curl -X POST http://localhost:3001/api/investors \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "taxId": "TAX123456",
    "spvId": "SPV_ID_FROM_STEP_1"
  }'

# Update investor
curl -X PUT http://localhost:3001/api/investors/{investorId} \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe Updated",
    "email": "john.updated@example.com",
    "taxId": "TAX789012"
  }'

# Delete investor
curl -X DELETE http://localhost:3001/api/investors/{investorId}


3. Tax Form Endpoints:

# Get tax forms by SPV
curl -X GET http://localhost:3001/api/tax-forms/spv/{spvId}

# Get tax forms by investor
curl -X GET http://localhost:3001/api/tax-forms/investor/{investorId}

# Create new tax form
curl -X POST http://localhost:3001/api/tax-forms \
  -H "Content-Type: application/json" \
  -d '{
    "formType": "K-1",
    "spvId": "SPV_ID_FROM_STEP_1",
    "investorId": "INVESTOR_ID_FROM_STEP_2"
  }'

# Update tax form status
curl -X PUT http://localhost:3001/api/tax-forms/{taxFormId}/status \
  -H "Content-Type: application/json" \
  -d '{
    "status": "completed"
  }'

# Update tax form download URL
curl -X PUT http://localhost:3001/api/tax-forms/{taxFormId}/download-url \
  -H "Content-Type: application/json" \
  -d '{
    "downloadUrl": "https://example.com/tax-forms/{taxFormId}"
  }'


```