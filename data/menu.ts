// app/data/menu.ts
// Single source of truth for ALL menu items (food + drinks)
// Used by: Staff Availability dashboard + later customer-side disabling

export type MenuItem = {
  id: string;                     // must be unique
  type: "food" | "drink";
  name: string;
  category: string;               // used for grouping in staff view
  img?: string;
};

/**
 * IMPORTANT:
 * - These items are derived from your food.vue + drinks.vue
 * - IDs are stable and human-readable
 * - Do NOT put prices or sizes here
 */

export const MENU_ITEMS: MenuItem[] = [
  // ======================
  // FOOD – BREAKFAST
  // ======================
  {
    id: "food-farmhouse-egg",
    type: "food",
    name: "Farm House Egg Sandwich",
    category: "Breakfast",
    img: "/food/farmhouse.jpg",
  },
  {
    id: "food-all-nighter",
    type: "food",
    name: "All Nighter Egg Sandwich",
    category: "Breakfast",
    img: "/food/allnighter.jpg",
  },
  {
    id: "food-garden-avocado",
    type: "food",
    name: "Garden Avocado Egg Sandwich",
    category: "Breakfast",
    img: "/food/garden-avocado.jpg",
  },

  // ======================
  // FOOD – BAKERY / MISC
  // ======================
  {
    id: "food-cinnamon-chip-muffin",
    type: "food",
    name: "Cinnamon Chip Muffin",
    category: "Misc.",
    img: "/food/cinnamon-chip-muffin.jpg",
  },

  // ======================
  // BAGELS
  // ======================
  {
    id: "bagel-plain",
    type: "food",
    name: "Plain Bagel",
    category: "Bagels",
    img: "/bagels/plain.jpg",
  },
  {
    id: "bagel-everything",
    type: "food",
    name: "Everything Bagel",
    category: "Bagels",
    img: "/bagels/everything.jpg",
  },
  {
    id: "bagel-sesame",
    type: "food",
    name: "Sesame Bagel",
    category: "Bagels",
    img: "/bagels/sesame.jpg",
  },
  {
    id: "bagel-asiago",
    type: "food",
    name: "Asiago Bagel",
    category: "Bagels",
    img: "/bagels/asiago.jpg",
  },
  {
    id: "bagel-cheesy-hash",
    type: "food",
    name: "Cheesy Hash Bagel",
    category: "Bagels",
    img: "/bagels/cheesy-hash.jpg",
  },

  // ======================
  // SHMEARS
  // ======================
  {
    id: "shmear-plain",
    type: "food",
    name: "Plain Shmear",
    category: "Shmears",
  },
  {
    id: "shmear-onion-chive",
    type: "food",
    name: "Onion Chive",
    category: "Shmears",
  },
  {
    id: "shmear-country-pepper",
    type: "food",
    name: "Country Pepper Shmear",
    category: "Shmears",
  },
  {
    id: "shmear-roasted-tomato",
    type: "food",
    name: "Roasted Tomato Spread",
    category: "Shmears",
  },

  // ======================
  // DRINKS – HOT
  // ======================
  {
    id: "drink-latte",
    type: "drink",
    name: "Latte",
    category: "Drinks",
    img: "/drinks/latte.jpg",
  },
  {
    id: "drink-chai-tea-latte",
    type: "drink",
    name: "Chai Tea Latte",
    category: "Drinks",
    img: "/drinks/chai.jpg",
  },

  // ======================
  // DRINKS – COLD
  // ======================
  {
    id: "drink-cold-brew",
    type: "drink",
    name: "Cold Brew",
    category: "Drinks",
    img: "/drinks/coldbrew.jpg",
  },
  {
    id: "drink-chocolate-cream-cold-brew",
    type: "drink",
    name: "Chocolate Cream Cold Brew",
    category: "Drinks",
    img: "/drinks/chocolate-cream-coldbrew.jpg",
  },
];
