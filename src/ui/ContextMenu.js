// OSRS-style right-click context menu: a floating list of action items at
// the click point, dismissed by clicking elsewhere or pressing Escape.

export class ContextMenu {
  constructor() {
    this.el = document.createElement('div');
    this.el.id = 'context-menu';
    this.el.classList.add('hidden');
    document.body.appendChild(this.el);

    document.addEventListener('click', () => this.hide());
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') this.hide();
    });
    this.el.addEventListener('click', (event) => event.stopPropagation());
  }

  show(x, y, items) {
    this.el.innerHTML = '';
    for (const item of items) {
      const row = document.createElement('div');
      row.className = 'context-menu-item';
      row.textContent = item.label;
      row.addEventListener('click', () => {
        item.onClick();
        this.hide();
      });
      this.el.appendChild(row);
    }
    this.el.style.left = `${x}px`;
    this.el.style.top = `${y}px`;
    this.el.classList.remove('hidden');
  }

  hide() {
    this.el.classList.add('hidden');
  }
}
