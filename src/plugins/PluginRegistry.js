// Generic plugin framework: each plugin declares default settings + a config
// schema (for the settings panel to render controls from), and reacts to
// setting changes. Settings persist to localStorage across sessions.

const STORAGE_KEY = 'vardorvis-sim.plugin-settings';

export class PluginRegistry {
  constructor(sceneManager) {
    this.sceneManager = sceneManager;
    this.plugins = new Map();
    this.settings = this._loadSettings();
  }

  register(plugin) {
    this.plugins.set(plugin.id, plugin);
    if (!this.settings[plugin.id]) {
      this.settings[plugin.id] = { ...plugin.defaultSettings };
    }
    if (plugin.init) plugin.init(this.sceneManager);
    if (plugin.onSettingsChange) plugin.onSettingsChange(this.settings[plugin.id]);
  }

  get(pluginId) {
    return this.plugins.get(pluginId);
  }

  getSettings(pluginId) {
    return this.settings[pluginId];
  }

  updateSetting(pluginId, key, value) {
    this.settings[pluginId][key] = value;
    this._saveSettings();
    const plugin = this.plugins.get(pluginId);
    if (plugin?.onSettingsChange) plugin.onSettingsChange(this.settings[pluginId]);
  }

  list() {
    return Array.from(this.plugins.values());
  }

  _loadSettings() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }

  _saveSettings() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.settings));
    } catch {
      // ignore storage errors (private browsing, quota, etc.)
    }
  }
}
