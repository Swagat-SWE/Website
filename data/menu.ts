// app/data/menu.ts

export type MenuItem = {
  id: string;
  name: string;
  category: string;
  type: "food" | "drink";
};

export const MENU_ITEMS: MenuItem[] = [
  { id: "farmhouse", name: "Farmhouse", category: "Menu Items", type: "food" },
  { id: "garden-avocado", name: "Garden Avocado", category: "Menu Items", type: "food" },
  { id: "all-nighter", name: "All-nighter", category: "Menu Items", type: "food" },
  { id: "burrito", name: "Burrito", category: "Menu Items", type: "food" },
  { id: "b-a-t", name: "B,A&T", category: "Menu Items", type: "food" },
  { id: "santa-fe", name: "Santa Fe", category: "Menu Items", type: "food" },
  { id: "nova-lox", name: "Nova Lox", category: "Menu Items", type: "food" },
  { id: "t-b-a", name: "T,B&A", category: "Menu Items", type: "food" },
  { id: "tasty-turkey", name: "Tasty Turkey", category: "Menu Items", type: "food" },
  { id: "avocado-veg-out", name: "Avocado veg out", category: "Menu Items", type: "food" },
  { id: "albuquerque-turkey", name: "Albuquerque Turkey", category: "Menu Items", type: "food" },
  { id: "pepperoni-chicken", name: "Pepperoni Chicken", category: "Menu Items", type: "food" },
  { id: "spicy-chicken", name: "Spicy Chicken", category: "Menu Items", type: "food" },
  { id: "cheesy-veggie-melt", name: "Cheesy Veggie Melt", category: "Menu Items", type: "food" },
];
