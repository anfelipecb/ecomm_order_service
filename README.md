# E-Commerce Order Service

REST API for order management.

## Structure

```
ecomm_order_service/
├── src/           # Source code
├── config/        # Configuration files
├── tests/         # Test files
├── package.json
└── README.md
```

## Getting Started

1. Install dependencies: `npm install`
2. Start the service: `npm start` (runs on port 3002 by default)
3. Run tests: `npm test`

## Environment Variables

- `DB_HOST` - PostgreSQL host (default: localhost)
- `DB_NAME` - Database name (default: ecommerce)
- `DB_USER` - Database user (default: postgres)
- `DB_PASSWORD` - Database password (default: password)
- `PRODUCT_SERVICE_URL` - Product service URL (default: http://localhost:3001)
- `PORT` - Service port (default: 3002)

## Prerequisites

- Node.js 18+
- PostgreSQL with schema from ecomm_database
- Product service running
