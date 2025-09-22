pub mod payments;

use tauri::command;

#[command]
pub fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[command]
pub fn send_message(message: String) -> String {
    format!("Message sent: {}", message)
}

#[command]
pub fn get_messages() -> Vec<String> {
    vec!["Message 1".to_string(), "Message 2".to_string()]
}
