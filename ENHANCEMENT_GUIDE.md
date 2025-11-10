# System Enhancement Guide

## Overview
This document outlines the enhancements made to the Real Estate Platform before the first real client trial.

## 1. Deals & Commissions System

### Schema Changes
- **Deal Model** updated with:
  - `clientId` (optional relation to User)
  - `dealType` (sale/rent)
  - `dealValue` (primary field, syncs with salePrice for backward compatibility)
  - `commissionValue` (auto-calculated: dealValue * commissionRate)
  - `dateClosed` (timestamp, auto-set when status = 'closed')
  - `status` (open/closed/cancelled, default: 'open')

### API Endpoints
- `POST /api/deals` - Create new deal
- `GET /api/deals` - Get all deals (filtered by brokerId, companyId, clientId, status)
- `GET /api/deals/:id` - Get deal by ID
- `PUT /api/deals/:id` - Update deal (auto-recalculates commission on value/rate change)
- `DELETE /api/deals/:id` - Delete deal (admin only)

### Commission Calculation
- **Formula**: `commissionValue = dealValue * commissionRate`
- **Broker Share**: 70% of commission (0.7 * commissionValue)
- **Company Share**: 30% of commission (0.3 * commissionValue)
- Auto-calculated on create/update

## 2. Multi-Tenant Support

### Schema Changes
Added `companyId` (nullable) to:
- `User` model
- `Property` model
- `Lead` model

### API Behavior
- All API queries filter by `companyId` when available
- Users from different companies are isolated
- Admins can see all companies (for future SaaS admin panel)
- Backward compatible: works in single-company mode (companyId = null)

## 3. Migration Steps

1. **Run Prisma Migration**:
```bash
cd backend
npx prisma migrate dev --name enhance_deals_and_multi_tenant
npm run prisma:generate
```

2. **Update Existing Data** (if needed):
- Set `companyId = null` for existing records (single-company mode)
- Migrate existing deals: set `dealValue = salePrice`, `status = 'closed'` if needed

## 4. Dashboard Features (To Be Implemented)

### Admin Dashboard
- Deals Management tab
- Reports: Total deals, commissions per broker, earnings per company
- Filters: By status, broker, company, date range

### Broker Dashboard
- My Deals tab
- Commission summary
- Deal creation form

## 5. UX Improvements (To Be Implemented)

- Loading states for forms and tables
- Error messages for failed API calls
- Form validation (required fields, numeric values)
- Responsive Dashboard (mobile & desktop)
- Status indicators for deals (color-coded badges)

## Notes
- All changes are backward compatible
- Existing API calls using `salePrice` still work (synced with `dealValue`)
- Multi-tenant isolation is optional (works with companyId = null)

