// 데스크톱에서만 tray 관련 모듈 import
#[cfg(desktop)]
use tauri::{
    menu::{Menu, MenuItem},
    tray::{MouseButton, TrayIconBuilder, TrayIconEvent},
    Manager,
};

// 모바일에서는 Manager가 현재 사용되지 않으므로 주석 처리
// #[cfg(mobile)]
// use tauri::Manager;

use lazy_static::lazy_static;
use std::sync::{Arc, Mutex};
use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize, Clone)]
struct Payment {
    id: u32,
    amount: f64,
    description: String,
    date: String,
}

lazy_static! {
    static ref PAYMENTS: Arc<Mutex<Vec<Payment>>> = Arc::new(Mutex::new(Vec::new()));
}

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn send_message(message: String) -> String {
    format!("Message sent: {}", message)
}

#[tauri::command]
fn get_messages() -> Vec<String> {
    vec!["Message 1".to_string(), "Message 2".to_string()]
}

#[tauri::command]
fn add_payment(amount: f64, description: String, date: String) -> Result<String, String> {
    let mut payments = PAYMENTS.lock().map_err(|_| "Failed to lock payments".to_string())?;
    let id = payments.len() as u32 + 1;
    payments.push(Payment { id, amount, description, date });
    Ok(format!("Payment added: ID {}", id))
}

#[tauri::command]
fn get_payments() -> Vec<Payment> {
    let payments = PAYMENTS.lock().unwrap();
    payments.clone()
}

#[tauri::command]
fn delete_payment(id: u32) -> Result<String, String> {
    let mut payments = PAYMENTS.lock().map_err(|_| "Failed to lock payments".to_string())?;
    if let Some(index) = payments.iter().position(|p| p.id == id) {
        payments.remove(index);
        Ok(format!("Payment deleted: ID {}", id))
    } else {
        Err("Payment not found".to_string())
    }
}

#[cfg(desktop)]
fn setup_tray(app: &mut tauri::App) -> tauri::Result<()> {
    let quit_i = MenuItem::with_id(app, "quit", "Quit", true, None::<&str>)?;
    let show_i = MenuItem::with_id(app, "show", "Show", true, None::<&str>)?;
    let hide_i = MenuItem::with_id(app, "hide", "Hide", true, None::<&str>)?;

    let menu = Menu::with_items(app, &[&show_i, &hide_i, &quit_i])?;

    let _tray = TrayIconBuilder::new()
        .icon(app.default_window_icon().unwrap().clone())
        .menu(&menu)
        .tooltip("Kiosk Payment App")
        .on_menu_event(move |app, event| match event.id.as_ref() {
            "quit" => {
                app.exit(0);
            }
            "show" => {
                if let Some(window) = app.get_webview_window("main") {
                    let _ = window.show();
                    let _ = window.set_focus();
                }
            }
            "hide" => {
                if let Some(window) = app.get_webview_window("main") {
                    let _ = window.hide();
                }
            }
            _ => {}
        })
        .on_tray_icon_event(|tray, event| {
            if let TrayIconEvent::Click {
                button: MouseButton::Left,
                ..
            } = event
            {
                let app = tray.app_handle();
                if let Some(window) = app.get_webview_window("main") {
                    let _ = window.show();
                    let _ = window.set_focus();
                }
            }
        })
        .build(app)?;

    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let builder = tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            greet,
            send_message,
            get_messages,
            add_payment,
            get_payments,
            delete_payment,
        ]);

    let builder = if cfg!(desktop) {
        builder
            .setup(|_app| {
                #[cfg(desktop)]
                setup_tray(_app)?; // 조건부 컴파일 추가
                Ok(())
            })
            .on_window_event(|_window, event| {
                if let tauri::WindowEvent::CloseRequested { api, .. } = event {
                    api.prevent_close();
                }
            })
    } else if cfg!(mobile) {
        builder.setup(|_app| {
            // 모바일 전용 초기화 코드
            Ok(())
        })
    } else {
        builder
    };

    builder
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
