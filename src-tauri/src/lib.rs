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

// 데스크톱 전용 트레이 설정 함수
#[cfg(desktop)]
fn setup_tray(app: &mut tauri::App) -> tauri::Result<()> {
    // 트레이 메뉴 생성
    let quit_i = MenuItem::with_id(app, "quit", "Quit", true, None::<&str>)?;
    let show_i = MenuItem::with_id(app, "show", "Show", true, None::<&str>)?;
    let hide_i = MenuItem::with_id(app, "hide", "Hide", true, None::<&str>)?;

    let menu = Menu::with_items(app, &[&show_i, &hide_i, &quit_i])?;

    // 트레이 아이콘 생성
    let _tray = TrayIconBuilder::new()
        .icon(app.default_window_icon().unwrap().clone())
        .menu(&menu)
        .tooltip("Chat App")
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
    let mut builder = tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            greet,
            send_message,
            get_messages
        ]);

    // 데스크톱에서만 트레이와 윈도우 이벤트 설정
    #[cfg(desktop)]
    {
        builder = builder
            .setup(|app| {
                setup_tray(app)?;
                Ok(())
            })
            .on_window_event(|window, event| {
                if let tauri::WindowEvent::CloseRequested { api, .. } = event {
                    window.hide().unwrap();
                    api.prevent_close();
                }
            });
    }

    // 모바일에서는 기본 설정만
    #[cfg(mobile)]
    {
        builder = builder.setup(|_app| {
            // 모바일 전용 초기화 코드가 필요하면 여기에
            Ok(())
        });
    }

    builder
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
