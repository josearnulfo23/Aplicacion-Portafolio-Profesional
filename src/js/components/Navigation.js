/**
 * ==========================================================================
 * COMPONENTE: Navigation
 * FUENTE: RF-012, RNF-007 (§5.3 del pseudocódigo)
 * ==========================================================================
 */

import { SITE_CONFIG } from "../config/constants.js";

export class Navigation {
  static renderizar(esMovil = false) {
    return SITE_CONFIG.NAV_ITEMS.map((item, index) => `
      <a href="${item.href}" class="nav-link ${index === 0 && !esMovil ? 'active' : ''}" data-nav-id="${item.id}">
        ${item.label}
      </a>
    `).join("");
  }
}
