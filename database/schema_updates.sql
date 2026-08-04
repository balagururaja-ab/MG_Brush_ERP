-- ---------------------------------------------------------
-- One-time Stock Balance Reconciliation
-- Rebuilds mgbrush.stock_balance from mgbrush.stock_ledger
-- ---------------------------------------------------------

BEGIN;

WITH ledger_totals AS (
	SELECT
		sl.item_id,
		COALESCE(sl.warehouse, 'MAIN') AS warehouse,
		ROUND(COALESCE(SUM(COALESCE(sl.qty_in, 0) - COALESCE(sl.qty_out, 0)), 0)::numeric, 3) AS current_qty,
		ROUND(
			CASE
				WHEN COALESCE(SUM(CASE WHEN COALESCE(sl.qty_in, 0) > 0 THEN sl.qty_in ELSE 0 END), 0) > 0
					THEN (
						SUM(CASE WHEN COALESCE(sl.qty_in, 0) > 0 THEN COALESCE(sl.qty_in, 0) * COALESCE(sl.unit_cost, 0) ELSE 0 END)
						/
						SUM(CASE WHEN COALESCE(sl.qty_in, 0) > 0 THEN COALESCE(sl.qty_in, 0) ELSE 0 END)
					)
				ELSE 0
			END::numeric,
			2
		) AS average_cost
	FROM mgbrush.stock_ledger sl
	GROUP BY sl.item_id, COALESCE(sl.warehouse, 'MAIN')
),
ledger_rollup AS (
	SELECT
		lt.item_id,
		lt.warehouse,
		lt.current_qty,
		lt.average_cost,
		ROUND(COALESCE(last_cost.unit_cost, 0)::numeric, 2) AS last_purchase_cost
	FROM ledger_totals lt
	LEFT JOIN LATERAL (
		SELECT sl2.unit_cost
		FROM mgbrush.stock_ledger sl2
		WHERE sl2.item_id = lt.item_id
		  AND COALESCE(sl2.warehouse, 'MAIN') = lt.warehouse
		  AND COALESCE(sl2.qty_in, 0) > 0
		ORDER BY sl2.transaction_date DESC, sl2.stock_ledger_id DESC
		LIMIT 1
	) last_cost ON TRUE
),
updated AS (
	UPDATE mgbrush.stock_balance sb
	SET
		current_qty = lr.current_qty,
		average_cost = lr.average_cost,
		last_purchase_cost = lr.last_purchase_cost,
		updated_at = CURRENT_TIMESTAMP
	FROM ledger_rollup lr
	WHERE sb.item_id = lr.item_id
	  AND sb.warehouse = lr.warehouse
	RETURNING sb.item_id, sb.warehouse
)
INSERT INTO mgbrush.stock_balance (
	item_id,
	warehouse,
	current_qty,
	average_cost,
	last_purchase_cost
)
SELECT
	lr.item_id,
	lr.warehouse,
	lr.current_qty,
	lr.average_cost,
	lr.last_purchase_cost
FROM ledger_rollup lr
LEFT JOIN updated u
	ON u.item_id = lr.item_id
   AND u.warehouse = lr.warehouse
WHERE u.item_id IS NULL;

COMMIT;
