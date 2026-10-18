INSERT INTO menu_categories (name, description, display_order)
VALUES
  ('Best Sellers', 'Customer favorites', 1),
  ('Meals', 'Main courses and rice meals', 2),
  ('Snacks', 'Light bites and sides', 3),
  ('Drinks', 'Cold and refreshing beverages', 4),
  ('Desserts', 'Sweet treats', 5)
ON CONFLICT (name) DO NOTHING;

INSERT INTO menu_items
  (category_id, name, description, price, image_url, is_available)
SELECT
  c.id,
  v.name,
  v.description,
  v.price,
  v.image_url,
  TRUE
FROM (
  VALUES
    (
      'Best Sellers',
      'Classic Burger',
      'Juicy burger with lettuce, tomato, cheese, and special sauce.',
      180.00::numeric,
      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800'
    ),
    (
      'Meals',
      'Baby Back Ribs',
      'Tender pork ribs served with our signature sauce.',
      350.00::numeric,
      'https://images.unsplash.com/photo-1544025162-d76694265947?w=800'
    ),
    (
      'Meals',
      'Kare-Kare',
      'A Filipino favorite with rich peanut sauce.',
      280.00::numeric,
      'https://images.unsplash.com/photo-1547592180-85f173990554?w=800'
    ),
    (
      'Snacks',
      'French Fries',
      'Crispy golden potato fries.',
      100.00::numeric,
      'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=800'
    ),
    (
      'Drinks',
      'Iced Tea',
      'Refreshing house-blend iced tea.',
      80.00::numeric,
      'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800'
    ),
    (
      'Desserts',
      'Chocolate Cake',
      'Chocolate cake for a sweet finish.',
      150.00::numeric,
      'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800'
    )
) AS v(category_name, name, description, price, image_url)
JOIN menu_categories c ON c.name = v.category_name
WHERE NOT EXISTS (
  SELECT 1
  FROM menu_items existing
  WHERE existing.category_id = c.id
    AND LOWER(existing.name) = LOWER(v.name)
);
