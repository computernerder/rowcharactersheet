'use strict';

(() => {
  const data = (typeof window !== 'undefined' && window.sheetData) ? window.sheetData : {};
  const fallback = (typeof window !== 'undefined' && window.sheetFallback) ? window.sheetFallback : {};
  const abilities = data.ability_scores || {};
  const skills = data.skills || {};

  const setField = (name, value) => {
    const el = document.querySelector(`[data-field="${name}"]`);
    if (el) el.textContent = value ?? "";
  };

  setField("character_name", data.character_name || fallback.name || "");
  setField("player", data.player || fallback.player || "");
  setField("profession", data.profession || fallback.profession || "");
  setField("primary_path", data.primary_path || "");
  const raceBlock = [data.race, data.ancestry, data.background]
    .map(v => (v ?? "").toString().trim())
    .filter(Boolean)
    .join(" / ");
  setField("race_block", raceBlock);
  setField("background", data.background || "");
  setField("race", data.race || "");
  setField("ancestry", data.ancestry || "");
  setField("stored_advance", data.stored_advance || "");
  setField("speed", data.speed ?? "");
  setField("initiative", data.initiative ?? "");

  const def = data.defense || {};
  setField("defense_base", def.base ?? "");
  setField("defense_agility", def.agility ?? "");
  setField("defense_shield", def.shield ?? "");
  setField("defense_misc", def.misc ?? "");
  setField("defense_total", def.total ?? "");

  const health = data.health || {};
  setField("health_max", health.max ?? "");
  setField("health_current", health.current ?? "");
  setField("health_wounds", health.wounds ?? "");

  const armor_hp = data.armor_hp || {};
  setField("armor_hp_max", armor_hp.max ?? "");
  setField("armor_hp_current", armor_hp.current ?? "");

  const life = data.life_points || {};
  setField("life_points_max", life.max ?? "");
  setField("life_points_current", life.current ?? "");

  const passive = data.passive || {};
  const percep = passive.perception || {};
  setField("passive_perception_base", percep.base ?? "");
  setField("passive_perception_skill", percep.skill ?? "");
  setField("passive_perception_misc", percep.misc ?? "");
  setField("passive_perception_total", percep.total ?? "");
  const insight = passive.insight || {};
  setField("passive_insight_base", insight.base ?? "");
  setField("passive_insight_skill", insight.skill ?? "");
  setField("passive_insight_misc", insight.misc ?? "");
  setField("passive_insight_total", insight.total ?? "");

  const attacks = data.attack_mods || {};
  const melee = attacks.melee || {};
  setField("attack_melee_attr", melee.attr ?? "");
  setField("attack_melee_misc", melee.misc ?? "");
  setField("attack_melee_total", melee.total ?? "");
  const ranged = attacks.ranged || {};
  setField("attack_ranged_attr", ranged.attr ?? "");
  setField("attack_ranged_misc", ranged.misc ?? "");
  setField("attack_ranged_total", ranged.total ?? "");

  const align = data.alignment || {};
  setField("alignment_alignment", align.alignment ?? "");
  setField("alignment_mod", align.mod ?? "");
  const rep = data.reputation || {};
  setField("reputation_reputation", rep.reputation ?? "");
  setField("reputation_mod", rep.mod ?? "");

  setField("level", data.level ?? "");
  setField("total_experience", data.total_experience ?? "");

  const phys = data.physical_traits || {};
  ["height","weight","size","age","creature_type","eyes","skin","hair"].forEach(k => setField(k, phys[k] ?? ""));

  const personality = data.personality || {};
  ["traits","ideal","bond","flaw"].forEach(k => setField(`personality_${k}`, personality[k] ?? ""));

  const footer = data.footer || {};
  setField("footer_datecode", footer.datecode ?? "");
  setField("footer_config", footer.config ?? "");
  setField("footer_id", footer.id ?? "");

  setField("inventory_total_weight", (data.inventory || {}).total_weight ?? "");
  setField("notes", data.notes ?? "");

  const spell = data.spellcrafting || {};
  setField("spell_save_dc", spell.save_dc ?? "");
  setField("spell_attack_bonus", spell.attack_bonus ?? "");
  const crafting = spell.crafting_points || {};
  setField("spell_cp_max", crafting.max ?? "");
  setField("spell_cp_current", crafting.current ?? "");
  setField("spell_casting", spell.casting ?? "");

  // Ability scores
  document.querySelectorAll("[data-ability]").forEach(row => {
    const label = row.getAttribute("data-ability");
    const parts = abilities[label] || {};
    row.querySelectorAll("[data-part]").forEach(cell => {
      const part = cell.getAttribute("data-part");
      const val = parts[part];
      cell.textContent = (val ?? "") === 0 ? 0 : (val ?? "");
    });
  });

  // Skills
  document.querySelectorAll("[data-skill]").forEach(row => {
    const name = row.getAttribute("data-skill");
    const skill = skills[name] || {};
    const tds = row.querySelectorAll("td");
    const checkbox = row.querySelector(".checkbox");
    if (skill.trained) checkbox.classList.add("checked");
    const parts = ["mod","rank","misc","total"];
    parts.forEach((part, idx) => {
      const val = skill[part];
      const target = tds[idx + 3];
      if (target) target.textContent = (val ?? "") === 0 ? 0 : (val ?? "");
    });
  });

  // Weapons
  const attackRows = document.querySelectorAll('[data-list="attacks"] tbody tr');
  (data.attacks || []).forEach((atk, idx) => {
    if (!attackRows[idx]) return;
    const cells = attackRows[idx].querySelectorAll("td");
    cells[0].textContent = atk.attack_action || "";
    cells[1].textContent = atk.bonus ?? "";
    cells[2].textContent = atk.damage || "";
    cells[3].textContent = atk.type || "";
    cells[4].textContent = atk.range || "";
  });

  // Lists
  const fillList = (selector, items) => {
    const cells = document.querySelectorAll(`${selector} td`);
    if (!cells.length) return;
    (items || []).forEach((item, idx) => {
      if (cells[idx]) cells[idx].textContent = item;
    });
  };

  const fillOverflowRich = (selector, items, fallbackLabel) => {
    const cells = document.querySelectorAll(`${selector} td`);
    if (!cells.length) return;
    (items || []).forEach((item, idx) => {
      const cell = cells[idx];
      if (!cell) return;
      cell.textContent = "";
      const parts = (item || "").split(":");
      const name = (parts.shift() || fallbackLabel || "Item").trim();
      const rest = parts.join(":").trim();
      const strong = document.createElement("strong");
      strong.textContent = name;
      cell.appendChild(strong);
      if (rest) cell.appendChild(document.createTextNode(`: ${rest}`));
    });
  };

  // Render lists with overflow handling: chunk labels into rows; send full items to definitions when lines exceed visible rows or items are too long
  const renderListWithOverflow = (mainSelector, overflowSelector, items, labels) => {
    const table = document.querySelector(mainSelector);
    if (!table) return;
    const cells = table.querySelectorAll('td');
    const MAX_ROWS = cells.length;
    const MAX_ITEM_CHARS = 80;
    const MAX_LINE_CHARS = 70;

    const labelList = (labels && labels.length ? labels : items || []).map(l => l || "");

    // Build lines that respect MAX_LINE_CHARS to avoid natural wrapping
    const lines = [];
    let current = "";
    labelList.forEach(label => {
      const piece = label.trim();
      if (!piece) return;
      if (!current) {
        current = piece;
      } else if ((current + ", " + piece).length <= MAX_LINE_CHARS) {
        current += ", " + piece;
      } else {
        lines.push(current);
        current = piece;
      }
    });
    if (current) lines.push(current);

    const hasLongItems = (items || []).some(it => (it || "").length > MAX_ITEM_CHARS);
    const needsOverflow = hasLongItems || lines.length > MAX_ROWS;

    // Render lines into visible rows
    cells.forEach(c => c.textContent = "");
    lines.slice(0, MAX_ROWS).forEach((line, idx) => {
      if (cells[idx]) cells[idx].textContent = line;
    });

    if (needsOverflow) {
      fillOverflowRich(overflowSelector, items, labels && labels[0] ? labels[0] : "Item");
    }
  };

  const featureItems = (data.features || []).map(f => f.name ? `${f.name}: ${f.text || ""}` : f.text || "");
  const talentItems = (data.talents || []).map(t => t.name ? `${t.name}: ${t.text || ""}` : t.text || "");
  const featureLabels = (data.features || []).map(f => f.name || (f.text || "").split(":")[0] || "Feature");
  const talentLabels = (data.talents || []).map(t => t.name || (t.text || "").split(":")[0] || "Talent");

  renderListWithOverflow('[data-list="features"]', '[data-list="features-overflow"]', featureItems, featureLabels);
  renderListWithOverflow('[data-list="talents"]', '[data-list="talents-overflow"]', talentItems, talentLabels);

  fillList('[data-list="proficiencies"]', data.proficiencies || []);
  fillList('[data-list="languages"]', data.languages || []);

  // Inventory items
  const inv = data.inventory || {};
  if (inv.items && inv.items.length) {
    const invEl = document.querySelector('[data-field="inventory_items"]');
    if (invEl) invEl.textContent = inv.items.join("\n");
  }

  // Spells
  const spellRows = document.querySelectorAll('[data-list="spells"] tbody tr');
  (spell.spells || []).forEach((sp, idx) => {
    if (!spellRows[idx]) return;
    const cells = spellRows[idx].querySelectorAll("td");
    cells[0].textContent = sp.name || "";
    cells[1].textContent = sp.cp ?? "";
    cells[2].textContent = sp.details || "";
  });
})();
