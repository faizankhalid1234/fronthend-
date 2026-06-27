import ramadanSheet from "../assets/refs/ramadan.png";
import appetizerSheet from "../assets/refs/appetizer.png";
import dealsSheet from "../assets/refs/deals-menu.png";
import barbequeSheet from "../assets/refs/barbeque.png";
import juicesSheet from "../assets/refs/juices.png";
import chowmienSheet from "../assets/refs/chowmien.png";
import shakesSheet from "../assets/refs/shakes.png";
import saladSheet from "../assets/refs/salad.png";

/** Grid layout tuned to your screenshot refs (1024px wide) */
export const menuSheets = {
  ramadan: {
    sheet: ramadanSheet,
    sheetW: 1024,
    sheetH: 393,
    cols: 3,
    header: 46,
    colGap: 16,
    rowGap: 12,
    imgSize: 128,
    rows: 3,
  },
  appetizer: {
    sheet: appetizerSheet,
    sheetW: 1024,
    sheetH: 306,
    cols: 3,
    header: 46,
    colGap: 16,
    rowGap: 14,
    imgSize: 128,
    rows: 2,
  },
  deals: {
    sheet: dealsSheet,
    sheetW: 1024,
    sheetH: 284,
    cols: 3,
    header: 40,
    colGap: 16,
    rowGap: 12,
    imgSize: 128,
    rows: 2,
  },
  barbeque: {
    sheet: barbequeSheet,
    sheetW: 1024,
    sheetH: 413,
    cols: 3,
    header: 46,
    colGap: 16,
    rowGap: 12,
    imgSize: 128,
    rows: 3,
  },
  juices: {
    sheet: juicesSheet,
    sheetW: 1024,
    sheetH: 369,
    cols: 3,
    header: 46,
    colGap: 16,
    rowGap: 14,
    imgSize: 128,
    rows: 2,
  },
  chowmien: {
    sheet: chowmienSheet,
    sheetW: 1024,
    sheetH: 357,
    cols: 3,
    header: 46,
    colGap: 16,
    rowGap: 14,
    imgSize: 128,
    rows: 2,
  },
  shakes: {
    sheet: shakesSheet,
    sheetW: 1024,
    sheetH: 264,
    cols: 3,
    header: 46,
    colGap: 16,
    rowGap: 0,
    imgSize: 128,
    rows: 1,
  },
  salad: {
    sheet: saladSheet,
    sheetW: 1024,
    sheetH: 321,
    cols: 3,
    header: 46,
    colGap: 16,
    rowGap: 12,
    imgSize: 128,
    rows: 2,
  },
};

export function getSheetPosition(categoryId, index) {
  const cfg = menuSheets[categoryId];
  if (!cfg) return null;

  const colW = (cfg.sheetW - cfg.colGap * (cfg.cols - 1)) / cfg.cols;
  const rows = cfg.rows;
  const rowH =
    (cfg.sheetH - cfg.header - cfg.rowGap * (rows - 1)) / rows;

  const row = Math.floor(index / cfg.cols);
  const col = index % cfg.cols;
  const left = col * (colW + cfg.colGap);
  const top = cfg.header + row * (rowH + cfg.rowGap);

  return { sheet: cfg.sheet, left, top, imgSize: cfg.imgSize };
}
