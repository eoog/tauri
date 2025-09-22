pub mod commands;
pub mod models;
pub mod database;

#[cfg(desktop)]
pub mod tray;

use tauri::Builder;
use tauri_plugin_sql::{Migration, MigrationKind};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    // 데이터베이스 마이그레이션 정의
    let migrations = vec![
        Migration {
            version: 1,
            description: "create_payments_table",
            sql: "CREATE TABLE IF NOT EXISTS payments (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                amount REAL NOT NULL,
                description TEXT NOT NULL,
                date TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 2,
            description: "create_indexes",
            sql: "CREATE INDEX IF NOT EXISTS idx_payments_date ON payments(date);
                  CREATE INDEX IF NOT EXISTS idx_payments_created_at ON payments(created_at);",
            kind: MigrationKind::Up,
        },
    ];

    #[allow(unused_mut)]
    let mut builder = Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(
            tauri_plugin_sql::Builder::default()
                .add_migrations("sqlite:payments.db", migrations)
                .build(),
        )
        .setup(|_app| {
            #[cfg(desktop)]
            tray::setup_tray(_app)?;

            println!("Application initialized with SQLite database");
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            commands::greet,
            commands::send_message,
            commands::get_messages,
            commands::payments::add_payment,
            commands::payments::get_payments,
            commands::payments::delete_payment,
            commands::payments::update_payment,
            commands::payments::get_payment_by_id,
            commands::payments::search_payments,
            commands::payments::get_payments_by_date_range,
            commands::payments::get_total_amount,
        ]);

    // 데스크톱에서만 창 이벤트 처리
    #[cfg(desktop)]
    {
        builder = builder.on_window_event(|window, event| {
            if let tauri::WindowEvent::CloseRequested { api, .. } = event {
                api.prevent_close();
                let _ = window.hide();
            }
        });
    }

    builder
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
