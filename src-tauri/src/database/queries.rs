// SQL 쿼리들을 상수로 정의하여 재사용성과 유지보수성을 높입니다.

pub const CREATE_PAYMENT: &str = "
    INSERT INTO payments (amount, description, date)
    VALUES ($1, $2, $3)
";

pub const GET_ALL_PAYMENTS: &str = "
    SELECT id, amount, description, date, created_at
    FROM payments
    ORDER BY created_at DESC
";

pub const GET_PAYMENT_BY_ID: &str = "
    SELECT id, amount, description, date, created_at
    FROM payments
    WHERE id = $1
";

pub const UPDATE_PAYMENT: &str = "
    UPDATE payments
    SET amount = COALESCE($2, amount),
        description = COALESCE($3, description),
        date = COALESCE($4, date)
    WHERE id = $1
";

pub const DELETE_PAYMENT: &str = "
    DELETE FROM payments WHERE id = $1
";

pub const SEARCH_PAYMENTS: &str = "
    SELECT id, amount, description, date, created_at
    FROM payments
    WHERE description LIKE '%' || $1 || '%' OR date LIKE '%' || $1 || '%'
    ORDER BY created_at DESC
";

pub const GET_PAYMENTS_BY_DATE_RANGE: &str = "
    SELECT id, amount, description, date, created_at
    FROM payments
    WHERE date BETWEEN $1 AND $2
    ORDER BY date DESC
";

pub const GET_TOTAL_AMOUNT: &str = "
    SELECT COALESCE(SUM(amount), 0) as total FROM payments
";

pub const GET_PAYMENT_STATS: &str = "
    SELECT
        COALESCE(SUM(amount), 0) as total_amount,
        COUNT(*) as total_count,
        COALESCE(AVG(amount), 0) as average_amount
    FROM payments
";
