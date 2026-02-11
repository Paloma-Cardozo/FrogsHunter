CREATE TABLE cards (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  image TEXT NOT NULL,
  alt TEXT NOT NULL,
  color TEXT NOT NULL);

INSERT INTO cards (name, image, alt, color) VALUES 
('frog1', 'Images/frog1.png', 'Smiling frog', '#ee76f8'),
('frog2', 'Images/frog2.png', 'Frog playing guitar', '#3a93f9'),
('frog3', 'Images/frog3.png', 'Frog with umbrella', '#f2ba49'),
('frog4', 'Images/frog4.png', 'Frog putting on makeup', '#5dcd5d'),
('frog5', 'Images/frog5.png', 'Dancing frog', '#db7866'),
('frog6', 'Images/frog6.png', 'Frog with a microphone', '#9566db'),
('frog7', 'Images/frog7.png', 'Frog with a walking stick', '#76f887'),
('frog8', 'Images/frog8.png', 'Frog eating', '#a476f8'),
('frog9', 'Images/frog9.png', 'Frog waving', '#fc6c56'),
('frog10', 'Images/frog10.png', 'Frog lying down', '#3d5fe3'),
('frog11', 'Images/frog11.png', 'Frog swimming', '#f876a6'),
('frog12', 'Images/frog12.png', 'Frog jumping', '#f2f876'),
('frog13', 'Images/frog13.png', 'Frog drinking a martini', '#768cf8'),
('frog14', 'Images/frog14.png', 'Singing frog', '#942e9e'),
('frog15', 'Images/frog15.png', 'Happy frog', '#3fe1f3'),
('frog16', 'Images/frog16.png', 'Frog saying goodbye', '#f87676'),
('frog17', 'Images/frog17.png', 'Frog sunbathing', '#f8e276'),
('frog18', 'Images/frog18.png', 'Frog catching a fish', '#8afd7b'),
('frog19', 'Images/frog19.png', 'Frog smelling a flower', '#43bef7'),
('frog20', 'Images/frog20.png', 'Frog playing a harmonica', '#fe67ae');
