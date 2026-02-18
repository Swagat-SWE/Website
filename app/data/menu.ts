// app/data/menu.ts
export type MenuItem = {
  id: string;
  name: string;
  category: string; // section header (Breakfast, Lunch, Bagels, etc.)
  page: "food" | "drinks"; // helps if you want separate pages later
  img?: string;
  price?: number;
};

export const MENU_ITEMS: MenuItem[] = [
  // ===== FOOD: Breakfast =====
  { id: "bs1", name: "Farm House Egg Sandwich", category: "Breakfast", page: "food", img: "EBB-SignatureEgg-Farmhouse-650x6501-1.jpg" },
  { id: "bs2", name: "All Nighter Egg Sandwich", category: "Breakfast", page: "food", img: "EBB-SignatureEgg-All-Nighter-650x6501-1.jpg" },
  { id: "bs3", name: "Garden Avocado Egg Sandwich", category: "Breakfast", page: "food", img: "EBB-SignatureEgg-GardenAvocado-650x6501-1.jpg" },
  { id: "bs4", name: "Bacon Cheddar Egg Sandwich", category: "Breakfast", page: "food", img: "EBB-Baconcheddar-Classic-Egg-Sandwich-1.jpg" },
  { id: "bs5", name: "Cheddar Egg Sandwich", category: "Breakfast", page: "food", img: "EBB-Cheddar-Classic-Egg-Sandwich.jpg" },
  { id: "bs6", name: "Ham Swiss Egg Sandwich", category: "Breakfast", page: "food", img: "EBB-Ham-Swiss-Classic-Egg-Sandwich.jpg" },
  { id: "bs7", name: "Turkey Sausage Egg Sandwich", category: "Breakfast", page: "food", img: "EBB-Turkey-Sausage-Cheddar-Classic-Egg-Sandwich.jpg" },
  { id: "bs8", name: "Bacon Avocado Tomato Sandwich", category: "Breakfast", page: "food", img: "EBB-SignatureEgg-BaconAvocadoTomatoEggWhite-650x6501-1.jpg" },
  { id: "bs9", name: "Santa Fe Egg White Sandwich", category: "Breakfast", page: "food", img: "EBB-SignatureEgg-SantaFeEggWhite-650x6501-1.jpg" },
  { id: "bs10", name: "Texas Brisket Egg Sandwich", category: "Breakfast", page: "food", img: "EBB-SignatureEgg-TexasBrisket-650x6501-1.jpg" },
  { id: "bs11", name: "Big Breakfast Burrito", category: "Breakfast", page: "food", img: "Burriro.png" },
  { id: "bs12", name: "Avocado Toast", category: "Breakfast", page: "food", img: "ToastAvo.png" },

  // ===== FOOD: Lunch =====
  { id: "l1", name: "Tastey Turkey Sandwich", category: "Lunch", page: "food", img: "/Tastey.png" },
  { id: "l2", name: "Avocado Veg Out Sandwich", category: "Lunch", page: "food", img: "/Veg.png" },
  { id: "l3", name: "Nova Lox Sandwich", category: "Lunch", page: "food", img: "/Nova.png" },
  { id: "l4", name: "Pepperoni Chicken", category: "Lunch", page: "food", img: "/Special.png" },
  { id: "l5", name: "Ham & Swiss Sandwich", category: "Lunch", page: "food", img: "/Ham.png" },
  { id: "l6", name: "Turkey, Bacon & Avocado Sandwich", category: "Lunch", page: "food", img: "/TT.png" },
  { id: "l7", name: "Spicy Chicken", category: "Lunch", page: "food", img: "/Chicken.png" },
  { id: "l8", name: "Cheesy Veggie Melt", category: "Lunch", page: "food", img: "/Veg.png" },
  { id: "l9", name: "Cheese Pizza Bagel", category: "Lunch", page: "food", img: "ChessyPiz.png" },
  { id: "l10", name: "Pepperoni Pizza Bagel", category: "Lunch", page: "food", img: "PeppyPiz.png" },
  { id: "l11", name: "Turkey and Cheddar", category: "Lunch", page: "food", img: "/Ham.png" },
  { id: "l12", name: "Chicken Salad", category: "Lunch", page: "food", img: "/TT.png" },
  { id: "l13", name: "Albuquerque Turkey", category: "Lunch", page: "food", img: "/TT.png" },

  // ===== FOOD: Bagels =====
  { id: "c1", name: "Plain Bagel", category: "Bagels", page: "food", img: "EBB-Bagel-Classic-Plain-1.jpg" },
  { id: "c2", name: "Cinnamon Raisin Bagel", category: "Bagels", page: "food", img: "EBB-Bagel-Classic-Cinnamon-Raisin.jpg" },
  { id: "c3", name: "Everything Bagel", category: "Bagels", page: "food", img: "EBB-Bagel-Classic-Everything.jpg" },
  { id: "c4", name: "Ancient Grain Bagel", category: "Bagels", page: "food", img: "EBB-Bagel-Classic-Ancient-Grain.jpg" },
  { id: "c5", name: "Sesame Seed Bagel", category: "Bagels", page: "food", img: "EBB-Bagel-Classic-Sesame-Seed.jpg" },
  { id: "c6", name: "Cheesy Hashbrown Bagel", category: "Bagels", page: "food", img: "EBB-Bagel-Gourmet-Cheesy-Hashbrown.jpg" },
  { id: "c7", name: "Six Cheese Bagel", category: "Bagels", page: "food", img: "EBB-Bagel-Gourmet-Six-Cheese.jpg" },
  { id: "c8", name: "Asiago Bagel", category: "Bagels", page: "food", img: "EBB-Bagel-Signature-Asiago-1.jpg" },
  { id: "c9", name: "Blueberry Bagel", category: "Bagels", page: "food", img: "EBB-Bagel-Signature-Blueberry.jpg" },
  { id: "c10", name: "Chocolate Chip Bagel", category: "Bagels", page: "food", img: "EBB-Bagel-Signature-Chocolate-Chip.jpg" },

  // ===== FOOD: Smears =====
  { id: "s1", name: "Plain", category: "Smears", page: "food", img: "PlainSmear.png" },
  { id: "s2", name: "Strawberry", category: "Smears", page: "food", img: "Straberry.png" },
  { id: "s3", name: "Almond", category: "Smears", page: "food", img: "Almond.png" },
  { id: "s4", name: "Country Pepper", category: "Smears", page: "food", img: "CountryPepper.png" },
  { id: "s5", name: "Garden Veggie", category: "Smears", page: "food", img: "GardenVeggie.png" },
  { id: "s6", name: "Onion Chive", category: "Smears", page: "food", img: "OnionChive.png" },

  // ===== FOOD: Other =====
  { id: "o1", name: "Cinnamon Chip Muffin", category: "Other", page: "food", img: "650x6501-1.jpeg" },
  { id: "o2", name: "Cinnamon Bliss Rolls", category: "Other", page: "food", img: "EBB-Cinnamon-Bliss-Roll-1.jpg" },
  { id: "o3", name: "Blueberry Muffin", category: "Other", page: "food", img: "EBB-Sweets-BlueberryMuffin-650x6501-1.jpg" },
  { id: "o4", name: "Chocolate Chip Cookie", category: "Other", page: "food", img: "EBB-Sweets-ChocolateChipCookie-650x6501-1.jpg" },
  { id: "o5", name: "Twice Baked Hashbrown", category: "Other", page: "food", img: "EBB-Twice-Baked-Hashbrown.jpg" },

  // ✅ Step 1: you said you still need to add Misc + Drink items:
  // Add them here with category like "Misc." or "Hot Drinks", "Cold Drinks", etc.
];
