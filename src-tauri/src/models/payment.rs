use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct Payment {
    pub id: Option<i64>,
    pub amount: f64,
    pub description: String,
    pub date: String,
    pub created_at: Option<String>,
}

impl Payment {
    pub fn new(amount: f64, description: String, date: String) -> Self {
        Self {
            id: None,
            amount,
            description,
            date,
            created_at: None,
        }
    }
}

#[derive(Serialize, Deserialize, Debug)]
pub struct PaymentUpdate {
    pub amount: Option<f64>,
    pub description: Option<String>,
    pub date: Option<String>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct PaymentStats {
    pub total_amount: f64,
    pub total_count: i64,
    pub average_amount: f64,
}
