use tauri::command;
use crate::models::payment::{PaymentUpdate, PaymentStats};

// 대부분의 데이터베이스 작업은 프론트엔드에서 직접 수행되지만,
// 복잡한 비즈니스 로직이나 검증이 필요한 경우 백엔드에서 처리합니다.

#[command]
pub async fn add_payment(
    amount: f64,
    description: String,
    date: String,
) -> Result<String, String> {
    // 입력 검증
    if amount <= 0.0 {
        return Err("Amount must be greater than 0".to_string());
    }

    if description.trim().is_empty() {
        return Err("Description cannot be empty".to_string());
    }

    if date.trim().is_empty() {
        return Err("Date cannot be empty".to_string());
    }

    // 프론트엔드에서 직접 SQL을 실행하도록 안내
    Ok("Use frontend SQL execution for adding payments".to_string())
}

#[command]
pub async fn get_payments() -> Result<String, String> {
    Ok("Use frontend SQL execution for getting payments".to_string())
}

#[command]
pub async fn delete_payment(id: i64) -> Result<String, String> {
    if id <= 0 {
        return Err("Invalid payment ID".to_string());
    }

    Ok("Use frontend SQL execution for deleting payments".to_string())
}

#[command]
pub async fn update_payment(
    id: i64,
    update: PaymentUpdate
) -> Result<String, String> {
    if id <= 0 {
        return Err("Invalid payment ID".to_string());
    }

    // 업데이트할 필드가 있는지 확인
    if update.amount.is_none() && update.description.is_none() && update.date.is_none() {
        return Err("No fields to update".to_string());
    }

    // amount 검증
    if let Some(amount) = update.amount {
        if amount <= 0.0 {
            return Err("Amount must be greater than 0".to_string());
        }
    }

    // description 검증
    if let Some(ref description) = update.description {
        if description.trim().is_empty() {
            return Err("Description cannot be empty".to_string());
        }
    }

    // date 검증
    if let Some(ref date) = update.date {
        if date.trim().is_empty() {
            return Err("Date cannot be empty".to_string());
        }
    }

    Ok("Use frontend SQL execution for updating payments".to_string())
}

#[command]
pub async fn get_payment_by_id(id: i64) -> Result<String, String> {
    if id <= 0 {
        return Err("Invalid payment ID".to_string());
    }

    Ok("Use frontend SQL execution for getting payment by ID".to_string())
}

#[command]
pub async fn search_payments(query: String) -> Result<String, String> {
    if query.trim().is_empty() {
        return Err("Search query cannot be empty".to_string());
    }

    Ok("Use frontend SQL execution for searching payments".to_string())
}

#[command]
pub async fn get_payments_by_date_range(
    start_date: String,
    end_date: String,
) -> Result<String, String> {
    if start_date.trim().is_empty() || end_date.trim().is_empty() {
        return Err("Start date and end date cannot be empty".to_string());
    }

    Ok("Use frontend SQL execution for getting payments by date range".to_string())
}

#[command]
pub async fn get_total_amount() -> Result<String, String> {
    Ok("Use frontend SQL execution for getting total amount".to_string())
}

// 복잡한 통계 계산을 위한 명령어 (실제 구현 예시)
#[command]
pub async fn get_payment_statistics() -> Result<PaymentStats, String> {
    // 이런 복잡한 계산은 백엔드에서 처리할 수 있습니다
    // 하지만 tauri-plugin-sql을 사용하면 프론트엔드에서도 가능합니다
    Ok(PaymentStats {
        total_amount: 0.0,
        total_count: 0,
        average_amount: 0.0,
    })
}
