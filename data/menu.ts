// app/data/menu.ts

export type MenuItem = {
  id: string;
  name: string;
  price: number;
  image?: string; // optional so your staff page won't crash if you don't have the image yet
  section: string; // "Breakfast", "Lunch", "Bagels", "Shmears", "Misc.", "Hot Drinks", etc.
  kind: "food" | "drink";
};

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function makeId(kind: "food" | "drink", name: string) {
  return `${kind}-${slugify(name)}`;
}

/**
 * IMPORTANT:
 * - Put image paths that match your Food/Drinks pages if you have them.
 * - If you don't have an image yet, you can omit "image" and it will still work.
 */

export const MENU_ITEMS: MenuItem[] = [
  // =========================
  // FOOD — Breakfast
  // =========================
  {
    id: makeId("food", "Farm House Egg Sandwich"),
    name: "Farm House Egg Sandwich",
    price: 6.99,
    image: "/images/food/farmhouse.jpg",
    section: "Breakfast",
    kind: "food",
  },
  {
    id: makeId("food", "All Nighter Egg Sandwich"),
    name: "All Nighter Egg Sandwich",
    price: 6.99,
    image: "/images/food/all-nighter.jpg",
    section: "Breakfast",
    kind: "food",
  },
  {
    id: makeId("food", "Garden Avocado Egg Sandwich"),
    name: "Garden Avocado Egg Sandwich",
    price: 6.99,
    image: "/images/food/garden-avocado.jpg",
    section: "Breakfast",
    kind: "food",
  },
  {
    id: makeId("food", "Bacon Cheddar Egg Sandwich"),
    name: "Bacon Cheddar Egg Sandwich",
    price: 6.99,
    image: "/images/food/bacon-cheddar.jpg",
    section: "Breakfast",
    kind: "food",
  },
  {
    id: makeId("food", "Cheddar Egg Sandwich"),
    name: "Cheddar Egg Sandwich",
    price: 6.99,
    image: "/images/food/cheddar-egg.jpg",
    section: "Breakfast",
    kind: "food",
  },
  {
    id: makeId("food", "Ham Swiss Egg Sandwich"),
    name: "Ham Swiss Egg Sandwich",
    price: 6.99,
    image: "/images/food/ham-swiss-egg.jpg",
    section: "Breakfast",
    kind: "food",
  },
  {
    id: makeId("food", "Turkey Sausage Egg Sandwich"),
    name: "Turkey Sausage Egg Sandwich",
    price: 6.99,
    image: "/images/food/turkey-sausage.jpg",
    section: "Breakfast",
    kind: "food",
  },
  {
    id: makeId("food", "Bacon Avocado Tomato Sandwich"),
    name: "Bacon Avocado Tomato Sandwich",
    price: 6.99,
    image: "/images/food/bacon-avocado-tomato.jpg",
    section: "Breakfast",
    kind: "food",
  },
  {
    id: makeId("food", "Santa Fe Egg White Sandwich"),
    name: "Santa Fe Egg White Sandwich",
    price: 6.99,
    image: "/images/food/santa-fe.jpg",
    section: "Breakfast",
    kind: "food",
  },
  {
    id: makeId("food", "Texas Brisket Egg Sandwich"),
    name: "Texas Brisket Egg Sandwich",
    price: 6.99,
    image: "/images/food/texas-brisket.jpg",
    section: "Breakfast",
    kind: "food",
  },
  {
    id: makeId("food", "Big Breakfast Burrito"),
    name: "Big Breakfast Burrito",
    price: 6.99,
    image: "/images/food/breakfast-burrito.jpg",
    section: "Breakfast",
    kind: "food",
  },
  {
    id: makeId("food", "Avocado Toast"),
    name: "Avocado Toast",
    price: 5.99,
    image: "/images/food/avocado-toast.jpg",
    section: "Breakfast",
    kind: "food",
  },

  // =========================
  // FOOD — Lunch
  // =========================
  {
    id: makeId("food", "Tastey Turkey Sandwich"),
    name: "Tastey Turkey Sandwich",
    price: 7.99,
    image: "/images/food/tastey-turkey.jpg",
    section: "Lunch",
    kind: "food",
  },
  {
    id: makeId("food", "Avocado Veg Out Sandwich"),
    name: "Avocado Veg Out Sandwich",
    price: 7.99,
    image: "/images/food/avocado-veg-out.jpg",
    section: "Lunch",
    kind: "food",
  },
  {
    id: makeId("food", "Nova Lox Sandwich"),
    name: "Nova Lox Sandwich",
    price: 8.99,
    image: "/images/food/nova-lox.jpg",
    section: "Lunch",
    kind: "food",
  },
  {
    id: makeId("food", "Pepperoni Chicken"),
    name: "Pepperoni Chicken",
    price: 7.99,
    image: "/images/food/pepperoni-chicken.jpg",
    section: "Lunch",
    kind: "food",
  },
  {
    id: makeId("food", "Ham & Swiss Sandwich"),
    name: "Ham & Swiss Sandwich",
    price: 7.99,
    image: "/images/food/ham-swiss.jpg",
    section: "Lunch",
    kind: "food",
  },
  {
    id: makeId("food", "Turkey, Bacon & Avocado Sandwich"),
    name: "Turkey, Bacon & Avocado Sandwich",
    price: 7.99,
    image: "/images/food/turkey-bacon-avocado.jpg",
    section: "Lunch",
    kind: "food",
  },
  {
    id: makeId("food", "Spicy Chicken"),
    name: "Spicy Chicken",
    price: 7.99,
    image: "/images/food/spicy-chicken.jpg",
    section: "Lunch",
    kind: "food",
  },
  {
    id: makeId("food", "Cheesy Veggie Melt"),
    name: "Cheesy Veggie Melt",
    price: 7.99,
    image: "/images/food/cheesy-veggie-melt.jpg",
    section: "Lunch",
    kind: "food",
  },
  {
    id: makeId("food", "Cheese Pizza Bagel"),
    name: "Cheese Pizza Bagel",
    price: 5.99,
    image: "/images/food/cheese-pizza-bagel.jpg",
    section: "Lunch",
    kind: "food",
  },
  {
    id: makeId("food", "Pepperoni Pizza Bagel"),
    name: "Pepperoni Pizza Bagel",
    price: 5.99,
    image: "/images/food/pepperoni-pizza-bagel.jpg",
    section: "Lunch",
    kind: "food",
  },
  {
    id: makeId("food", "Turkey and Cheddar"),
    name: "Turkey and Cheddar",
    price: 7.99,
    image: "/images/food/turkey-cheddar.jpg",
    section: "Lunch",
    kind: "food",
  },
  {
    id: makeId("food", "Chicken Salad"),
    name: "Chicken Salad",
    price: 7.99,
    image: "/images/food/chicken-salad.jpg",
    section: "Lunch",
    kind: "food",
  },
  {
    id: makeId("food", "Albuquerque Turkey"),
    name: "Albuquerque Turkey",
    price: 7.99,
    image: "/images/food/albuquerque-turkey.jpg",
    section: "Lunch",
    kind: "food",
  },

  // =========================
  // FOOD — Bagels
  // =========================
  { id: makeId("food", "Plain Bagel"), name: "Plain Bagel", price: 2.49, image: "/images/bagels/plain.jpg", section: "Bagels", kind: "food" },
  { id: makeId("food", "Cinnamon Raisin Bagel"), name: "Cinnamon Raisin Bagel", price: 2.49, image: "/images/bagels/cinnamon-raisin.jpg", section: "Bagels", kind: "food" },
  { id: makeId("food", "Everything Bagel"), name: "Everything Bagel", price: 2.49, image: "/images/bagels/everything.jpg", section: "Bagels", kind: "food" },
  { id: makeId("food", "Ancient Grain Bagel"), name: "Ancient Grain Bagel", price: 2.49, image: "/images/bagels/ancient-grain.jpg", section: "Bagels", kind: "food" },
  { id: makeId("food", "Sesame Seed Bagel"), name: "Sesame Seed Bagel", price: 2.49, image: "/images/bagels/sesame.jpg", section: "Bagels", kind: "food" },
  { id: makeId("food", "Cheesy Hashbrown Bagel"), name: "Cheesy Hashbrown Bagel", price: 2.99, image: "/images/bagels/cheesy-hashbrown.jpg", section: "Bagels", kind: "food" },
  { id: makeId("food", "Six Cheese Bagel"), name: "Six Cheese Bagel", price: 2.99, image: "/images/bagels/six-cheese.jpg", section: "Bagels", kind: "food" },
  { id: makeId("food", "Asiago Bagel"), name: "Asiago Bagel", price: 2.99, image: "/images/bagels/asiago.jpg", section: "Bagels", kind: "food" },
  { id: makeId("food", "Blueberry Bagel"), name: "Blueberry Bagel", price: 2.49, image: "/images/bagels/blueberry.jpg", section: "Bagels", kind: "food" },
  { id: makeId("food", "Chocolate Chip Bagel"), name: "Chocolate Chip Bagel", price: 2.49, image: "/images/bagels/chocolate-chip.jpg", section: "Bagels", kind: "food" },

  // =========================
  // FOOD — Shmears
  // =========================
  { id: makeId("food", "Plain Shmear"), name: "Plain", price: 1.49, image: "/images/shmears/plain.jpg", section: "Shmears", kind: "food" },
  { id: makeId("food", "Strawberry Shmear"), name: "Strawberry", price: 1.49, image: "/images/shmears/strawberry.jpg", section: "Shmears", kind: "food" },
  { id: makeId("food", "Almond Shmear"), name: "Almond", price: 1.49, image: "/images/shmears/almond.jpg", section: "Shmears", kind: "food" },
  { id: makeId("food", "Country Pepper Shmear"), name: "Country Pepper", price: 1.49, image: "/images/shmears/country-pepper.jpg", section: "Shmears", kind: "food" },
  { id: makeId("food", "Garden Veggie Shmear"), name: "Garden Veggie", price: 1.49, image: "/images/shmears/garden-veggie.jpg", section: "Shmears", kind: "food" },
  { id: makeId("food", "Onion Chive Shmear"), name: "Onion Chive", price: 1.49, image: "/images/shmears/onion-chive.jpg", section: "Shmears", kind: "food" },

  // =========================
  // FOOD — Misc. (your “Other” section)
  // =========================
  { id: makeId("food", "Cinnamon Chip Muffin"), name: "Cinnamon Chip Muffin", price: 3.49, image: "/images/misc/cinnamon-chip-muffin.jpg", section: "Misc.", kind: "food" },
  { id: makeId("food", "Cinnamon Bliss Rolls"), name: "Cinnamon Bliss Rolls", price: 3.49, image: "/images/misc/cinnamon-bliss-roll.jpg", section: "Misc.", kind: "food" },
  { id: makeId("food", "Blueberry Muffin"), name: "Blueberry Muffin", price: 3.49, image: "/images/misc/blueberry-muffin.jpg", section: "Misc.", kind: "food" },
  { id: makeId("food", "Chocolate Chip Cookie"), name: "Chocolate Chip Cookie", price: 2.99, image: "/images/misc/chocolate-chip-cookie.jpg", section: "Misc.", kind: "food" },
  { id: makeId("food", "Twice Baked Hashbrown"), name: "Twice Baked Hashbrown", price: 2.49, image: "/images/misc/twice-baked-hashbrown.jpg", section: "Misc.", kind: "food" },

  // =========================
  // DRINKS — Hot Drinks
  // =========================
  { id: makeId("drink", "Mocha"), name: "Mocha", price: 4.69, image: "/images/drinks/mocha-hot.jpg", section: "Hot Drinks", kind: "drink" },
  { id: makeId("drink", "Latte (Hot)"), name: "Latte", price: 4.19, image: "/images/drinks/latte-hot.jpg", section: "Hot Drinks", kind: "drink" },
  { id: makeId("drink", "Caramel Macchiato (Hot)"), name: "Caramel Macchiato", price: 5.29, image: "/images/drinks/caramel-macchiato-hot.jpg", section: "Hot Drinks", kind: "drink" },
  { id: makeId("drink", "Chai Tea Latte (Hot)"), name: "Chai Tea Latte", price: 4.19, image: "/images/drinks/chai-hot.jpg", section: "Hot Drinks", kind: "drink" },
  { id: makeId("drink", "Hot Chocolate"), name: "Hot Chocolate", price: 3.99, image: "/images/drinks/hot-chocolate.jpg", section: "Hot Drinks", kind: "drink" },
  { id: makeId("drink", "Coffee"), name: "Coffee", price: 4.99, image: "/images/drinks/coffee.jpg", section: "Hot Drinks", kind: "drink" },

  // =========================
  // DRINKS — Cold Drinks
  // =========================
  { id: makeId("drink", "Classic Cold Brew"), name: "Classic Cold Brew", price: 3.49, image: "/images/drinks/classic-cold-brew.jpg", section: "Cold Drinks", kind: "drink" },
  { id: makeId("drink", "Chocolate Cream Cold Brew"), name: "Chocolate Cream Cold Brew", price: 4.99, image: "/images/drinks/choc-cream-cold-brew.jpg", section: "Cold Drinks", kind: "drink" },
  { id: makeId("drink", "Vanilla Cream Cold Brew"), name: "Vanilla Cream Cold Brew", price: 4.99, image: "/images/drinks/vanilla-cream-cold-brew.jpg", section: "Cold Drinks", kind: "drink" },
  { id: makeId("drink", "Caramel Cream Cold Brew"), name: "Caramel Cream Cold Brew", price: 4.99, image: "/images/drinks/caramel-cream-cold-brew.jpg", section: "Cold Drinks", kind: "drink" },
  { id: makeId("drink", "Chocolate Cold Brew Shake"), name: "Chocolate Cold Brew Shake", price: 4.99, image: "/images/drinks/choc-cold-brew-shake.jpg", section: "Cold Drinks", kind: "drink" },
  { id: makeId("drink", "Vanilla Cold Brew Shake"), name: "Vanilla Cold Brew Shake", price: 4.99, image: "/images/drinks/vanilla-cold-brew-shake.jpg", section: "Cold Drinks", kind: "drink" },
  { id: makeId("drink", "Caramel Cold Brew Shake"), name: "Caramel Cold Brew Shake", price: 4.99, image: "/images/drinks/caramel-cold-brew-shake.jpg", section: "Cold Drinks", kind: "drink" },

  // =========================
  // DRINKS — Tea & Smoothies
  // =========================
  { id: makeId("drink", "Hot Tea"), name: "Hot Tea", price: 3.99, image: "/images/drinks/hot-tea.jpg", section: "Tea & Smoothies", kind: "drink" },
  { id: makeId("drink", "Iced Tea"), name: "Iced Tea", price: 3.99, image: "/images/drinks/iced-tea.jpg", section: "Tea & Smoothies", kind: "drink" },
  { id: makeId("drink", "Strawberry Banana Smoothie"), name: "Strawberry Banana Smoothie", price: 4.99, image: "/images/drinks/strawberry-banana-smoothie.jpg", section: "Tea & Smoothies", kind: "drink" },

  // =========================
  // DRINKS — Bottled Drinks
  // =========================
  { id: makeId("drink", "Pepsi"), name: "Pepsi", price: 2.5, image: "/images/drinks/pepsi.jpg", section: "Bottled Drinks", kind: "drink" },
  { id: makeId("drink", "Diet Pepsi"), name: "Diet Pepsi", price: 2.5, image: "/images/drinks/diet-pepsi.jpg", section: "Bottled Drinks", kind: "drink" },
  { id: makeId("drink", "Mountain Dew"), name: "Mountain Dew", price: 2.5, image: "/images/drinks/mountain-dew.jpg", section: "Bottled Drinks", kind: "drink" },
  { id: makeId("drink", "Diet Mountain Dew"), name: "Diet Mountain Dew", price: 2.5, image: "/images/drinks/diet-mountain-dew.jpg", section: "Bottled Drinks", kind: "drink" },
  { id: makeId("drink", "Orange Juice"), name: "Orange Juice", price: 2.5, image: "/images/drinks/orange-juice.jpg", section: "Bottled Drinks", kind: "drink" },
  { id: makeId("drink", "Grape Juice"), name: "Grape Juice", price: 2.5, image: "/images/drinks/grape-juice.jpg", section: "Bottled Drinks", kind: "drink" },
  { id: makeId("drink", "Apple Juice"), name: "Apple Juice", price: 2.5, image: "/images/drinks/apple-juice.jpg", section: "Bottled Drinks", kind: "drink" },
  { id: makeId("drink", "Raspberry Iced Tea"), name: "Raspberry Iced Tea", price: 2.5, image: "/images/drinks/raspberry-iced-tea.jpg", section: "Bottled Drinks", kind: "drink" },
  { id: makeId("drink", "Unsweetened Iced Tea"), name: "Unsweetened Iced Tea", price: 2.5, image: "/images/drinks/unsweet-iced-tea.jpg", section: "Bottled Drinks", kind: "drink" },
  { id: makeId("drink", "Chocolate Milk"), name: "Chocolate Milk", price: 2.5, image: "/images/drinks/chocolate-milk.jpg", section: "Bottled Drinks", kind: "drink" },
  { id: makeId("drink", "White Milk"), name: "White Milk", price: 2.5, image: "/images/drinks/white-milk.jpg", section: "Bottled Drinks", kind: "drink" },
  { id: makeId("drink", "Water"), name: "Water", price: 2.5, image: "/images/drinks/water.jpg", section: "Bottled Drinks", kind: "drink" },
  { id: makeId("drink", "Lemon Lime Gatorade"), name: "Lemon Lime Gatorade", price: 2.5, image: "/images/drinks/gatorade-lemon-lime.jpg", section: "Bottled Drinks", kind: "drink" },
  { id: makeId("drink", "Cool Blue Gatorade"), name: "Cool Blue Gatorade", price: 2.5, image: "/images/drinks/gatorade-cool-blue.jpg", section: "Bottled Drinks", kind: "drink" },
];

export const STAFF_SECTION_ORDER = [
  "Breakfast",
  "Lunch",
  "Bagels",
  "Shmears",
  "Misc.",
  "Hot Drinks",
  "Cold Drinks",
  "Tea & Smoothies",
  "Bottled Drinks",
];
