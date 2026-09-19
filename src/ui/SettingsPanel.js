// Renders the plugin settings side panel (toggle + color/width controls per
// plugin) into a container element, reading/writing through PluginRegistry.

export class SettingsPanel {
  constructor(container, registry) {
    this.container = container;
    this.registry = registry;
    this.render();
  }

  render() {
    this.container.innerHTML = '';

    const title = document.createElement('h2');
    title.textContent = 'Plugins';
    this.container.appendChild(title);

    for (const plugin of this.registry.list()) {
      this.container.appendChild(this._buildPluginRow(plugin));
    }
  }

  _buildPluginRow(plugin) {
    const settings = this.registry.getSettings(plugin.id);

    const row = document.createElement('div');
    row.className = 'plugin-row';

    const header = document.createElement('label');
    header.className = 'plugin-header';
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = settings.enabled;
    checkbox.addEventListener('change', () => {
      this.registry.updateSetting(plugin.id, 'enabled', checkbox.checked);
    });
    header.appendChild(checkbox);
    header.appendChild(document.createTextNode(plugin.name));
    row.appendChild(header);

    for (const field of plugin.schema) {
      if (field.key === 'enabled') continue;
      row.appendChild(this._buildField(plugin, field, settings));
    }

    return row;
  }

  _buildField(plugin, field, settings) {
    const wrapper = document.createElement('div');
    wrapper.className = 'plugin-field';

    const label = document.createElement('label');
    label.textContent = field.label;
    wrapper.appendChild(label);

    const input = document.createElement('input');
    input.type = field.type === 'range' ? 'range' : field.type;
    if (field.type === 'range') {
      input.min = field.min;
      input.max = field.max;
      input.step = field.step;
    }
    input.value = settings[field.key];

    input.addEventListener('input', () => {
      const value = field.type === 'range' ? parseFloat(input.value) : input.value;
      this.registry.updateSetting(plugin.id, field.key, value);
    });

    wrapper.appendChild(input);
    return wrapper;
  }
}
