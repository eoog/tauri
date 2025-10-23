import { getCurrentWindow } from '@tauri-apps/api/window';
import './Titlebar.css';

function Titlebar() {
  const appWindow = getCurrentWindow();
  const handleMinimize = () => appWindow.minimize();
  const handleMaximize = () => appWindow.toggleMaximize();
  const handleClose = () => appWindow.close();

  return (
      <div data-tauri-drag-region className="titlebar">
        <div className="titlebar-title">내 앱</div>
        <div className="titlebar-buttons">
          <button className="titlebar-button" onClick={handleMinimize}>
            −
          </button>
          <button className="titlebar-button" onClick={handleMaximize}>
            □
          </button>
          <button className="titlebar-button close" onClick={handleClose}>
            ×
          </button>
        </div>
      </div>
  );

  st
}

export default Titlebar;
