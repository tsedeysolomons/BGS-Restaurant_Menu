-- Insert categories based on the BGS Restaurant menu
INSERT INTO categories (name, slug, description, sort_order) VALUES
('Shawarma', 'shawarma', 'Delicious shawarma wraps and platters', 1),
('Chicken Dishes', 'chicken-dishes', 'Grilled and roasted chicken specialties', 2),
('Fasting Menu', 'fasting-menu', 'Vegetarian and vegan options', 3),
('Drinks & Juices', 'drinks-juices', 'Fresh juices and beverages', 4),
('Extras', 'extras', 'Add-ons and sides', 5);

-- Insert menu items based on the provided menu images
-- Shawarma items
INSERT INTO menu_items (category_id, name, description, price, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'shawarma'), 'Special Chicken Shawarma', 'Premium chicken shawarma with special sauce', 530.00, 1),
((SELECT id FROM categories WHERE slug = 'shawarma'), 'Normal Shawarma', 'Classic shawarma wrap', 430.00, 2),
((SELECT id FROM categories WHERE slug = 'shawarma'), 'Family Style', 'Large shawarma platter for sharing', 2460.00, 3),
((SELECT id FROM categories WHERE slug = 'shawarma'), 'BGS Special', 'House special shawarma with premium ingredients', 1590.00, 4);

-- Chicken dishes
INSERT INTO menu_items (category_id, name, description, price, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'chicken-dishes'), 'Roasted Full Chicken', 'Whole roasted chicken with sides', 1990.00, 1),
((SELECT id FROM categories WHERE slug = 'chicken-dishes'), 'Roasted Half Chicken', 'Half roasted chicken with sides', 1090.00, 2),
((SELECT id FROM categories WHERE slug = 'chicken-dishes'), 'Chicken Grill', 'Grilled chicken breast with vegetables', 850.00, 3),
((SELECT id FROM categories WHERE slug = 'chicken-dishes'), 'Chicken Wing', 'Spicy chicken wings', 990.00, 4),
((SELECT id FROM categories WHERE slug = 'chicken-dishes'), 'Kapasa', 'Traditional Ethiopian chicken dish', 860.00, 5),
((SELECT id FROM categories WHERE slug = 'chicken-dishes'), 'Mofla', 'Spiced chicken with injera', 890.00, 6),
((SELECT id FROM categories WHERE slug = 'chicken-dishes'), 'Fassa', 'Chicken stew with vegetables', 690.00, 7),
((SELECT id FROM categories WHERE slug = 'chicken-dishes'), 'Akeda', 'Grilled chicken with traditional spices', 690.00, 8),
((SELECT id FROM categories WHERE slug = 'chicken-dishes'), 'Chicken Shekla Tibse', 'Pan-fried chicken with onions', 990.00, 9),
((SELECT id FROM categories WHERE slug = 'chicken-dishes'), 'Grill Chicken Breast', 'Grilled chicken breast fillet', 970.00, 10);

-- Fasting menu items
INSERT INTO menu_items (category_id, name, description, price, is_fasting, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'fasting-menu'), 'BGS Fasting Salad', 'Fresh mixed vegetable salad', 180.00, true, 1),
((SELECT id FROM categories WHERE slug = 'fasting-menu'), 'BGS Veggy Wrap', 'Vegetable wrap with fresh ingredients', 170.00, true, 2),
((SELECT id FROM categories WHERE slug = 'fasting-menu'), 'Cooked Vegetables', 'Seasonal cooked vegetables', 170.00, true, 3),
((SELECT id FROM categories WHERE slug = 'fasting-menu'), 'Salad with Rice', 'Fresh salad served with rice', 180.00, true, 4),
((SELECT id FROM categories WHERE slug = 'fasting-menu'), 'French Fries', 'Crispy golden french fries', 160.00, true, 5);

-- Drinks and juices
INSERT INTO menu_items (category_id, name, description, price, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'drinks-juices'), 'BGS Special Juice', 'House special fruit juice blend', 270.00, 1),
((SELECT id FROM categories WHERE slug = 'drinks-juices'), 'Orange Juice', 'Fresh squeezed orange juice', 240.00, 2),
((SELECT id FROM categories WHERE slug = 'drinks-juices'), 'Watermelon Juice', 'Fresh watermelon juice', 180.00, 3),
((SELECT id FROM categories WHERE slug = 'drinks-juices'), 'Pineapple Juice', 'Fresh pineapple juice', 210.00, 4),
((SELECT id FROM categories WHERE slug = 'drinks-juices'), 'Flaxseed Juice', 'Healthy flaxseed drink', 180.00, 5),
((SELECT id FROM categories WHERE slug = 'drinks-juices'), 'Carrot Juice', 'Fresh carrot juice', 180.00, 6),
((SELECT id FROM categories WHERE slug = 'drinks-juices'), 'Strawberry Juice', 'Fresh strawberry juice', 240.00, 7),
((SELECT id FROM categories WHERE slug = 'drinks-juices'), 'Dates Juice', 'Traditional dates drink', 210.00, 8),
((SELECT id FROM categories WHERE slug = 'drinks-juices'), 'Special Mojito', 'Refreshing mojito drink', 200.00, 9),
((SELECT id FROM categories WHERE slug = 'drinks-juices'), 'Lemon Mojito', 'Lemon flavored mojito', 170.00, 10),
((SELECT id FROM categories WHERE slug = 'drinks-juices'), 'Cinnamon Mojito', 'Cinnamon spiced mojito', 170.00, 11),
((SELECT id FROM categories WHERE slug = 'drinks-juices'), 'Strawberry Mojito', 'Strawberry flavored mojito', 170.00, 12),
((SELECT id FROM categories WHERE slug = 'drinks-juices'), 'Pineapple Mojito', 'Pineapple flavored mojito', 170.00, 13),
((SELECT id FROM categories WHERE slug = 'drinks-juices'), 'Mint Mojito', 'Classic mint mojito', 170.00, 14),
((SELECT id FROM categories WHERE slug = 'drinks-juices'), 'Coffee Mojito', 'Coffee flavored mojito', 170.00, 15),
((SELECT id FROM categories WHERE slug = 'drinks-juices'), 'Ginger Mojito', 'Ginger spiced mojito', 170.00, 16),
((SELECT id FROM categories WHERE slug = 'drinks-juices'), 'Soft Drink 300ml Glass Bottle', 'Bottled soft drink', 80.00, 17),
((SELECT id FROM categories WHERE slug = 'drinks-juices'), 'Ambo Water', 'Natural mineral water', 90.00, 18),
((SELECT id FROM categories WHERE slug = 'drinks-juices'), 'Ambo Flavored Water', 'Flavored mineral water', 90.00, 19),
((SELECT id FROM categories WHERE slug = 'drinks-juices'), 'Bottled Water 1/2 Liter', 'Pure bottled water', 60.00, 20);

-- Insert extras/add-ons
INSERT INTO extras (name, price) VALUES
('Mayonnaise', 50.00),
('Spice', 65.00),
('Pita', 30.00),
('French Fries', 130.00),
('Takeaway Container', 60.00),
('Paper Bag', 35.00),
('Cup', 25.00);
