-- Database schema updates for sales invoice and payment tracking

ALTER TABLE mgbrush.sales_header
    ADD COLUMN IF NOT EXISTS paid_amount numeric(18,2) DEFAULT 0;

ALTER TABLE mgbrush.sales_header
    ADD COLUMN IF NOT EXISTS pending_amount numeric(18,2) DEFAULT 0;

ALTER TABLE mgbrush.sales_header
    ADD COLUMN IF NOT EXISTS is_gst boolean DEFAULT false;

ALTER TABLE mgbrush.sales_header
    ADD COLUMN IF NOT EXISTS gst_percent numeric(5,2) DEFAULT 0;
