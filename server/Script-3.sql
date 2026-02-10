CREATE TABLE cards (
id INTEGER PRIMARY KEY AUTOINCREMENT,
name TEXT NOT NULL UNIQUE,
image_url TEXT NOT NULL,
alt TEXT NOT NULL,
color TEXT NOT NULL,
matched TEXT NOT NULL DEFAULT 'false'
);

INSERT INTO cards (name, image_url, alt, color, matched) VALUES ('frog1', 'images/frog1.png', 'Smiling frog', '#ee76f8', 'false');
INSERT INTO cards (name, image_url, alt, color, matched) VALUES ('frog2', 'images/frog2.png', 'Frog playing guitar', '#3a93f9', 'false');
INSERT INTO cards (name, image_url, alt, color, matched) VALUES ('frog3', 'images/frog3.png', 'Frog with umbrella', '#f2ba49', 'false');
INSERT INTO cards (name, image_url, alt, color, matched) VALUES ('frog4', 'images/frog4.png', 'Frog putting on makeup', '#5dcd5d', 'false');
INSERT INTO cards (name, image_url, alt, color, matched) VALUES ('frog5', 'images/frog5.png', 'Dancing frog', '#db7866', 'false');
INSERT INTO cards (name, image_url, alt, color, matched) VALUES ('frog6', 'images/frog6.png', 'Frog with a microphone', '#9566db', 'false');
INSERT INTO cards (name, image_url, alt, color, matched) VALUES ('frog7', 'images/frog7.png', 'Frog with a walking stick', '#76f887', 'false');
INSERT INTO cards (name, image_url, alt, color, matched) VALUES ('frog8', 'images/frog8.png', 'Frog eating', '#a476f8', 'false');
INSERT INTO cards (name, image_url, alt, color, matched) VALUES ('frog9', 'images/frog9.png', 'Frog waving', '#fc6c56', 'false');
INSERT INTO cards (name, image_url, alt, color, matched) VALUES ('frog10', 'images/frog10.png', 'Frog lying down', '#3d5fe3', 'false');
INSERT INTO cards (name, image_url, alt, color, matched) VALUES ('frog11', 'images/frog11.png', 'Frog swimming', '#f876a6', 'false');
INSERT INTO cards (name, image_url, alt, color, matched) VALUES ('frog12', 'images/frog12.png', 'Frog jumping', '#f2f876', 'false');
INSERT INTO cards (name, image_url, alt, color, matched) VALUES ('frog13', 'images/frog13.png', 'Frog drinking a martini', '#768cf8', 'false');
INSERT INTO cards (name, image_url, alt, color, matched) VALUES ('frog14', 'images/frog14.png', 'Singing frog', '#942e9e', 'false');
INSERT INTO cards (name, image_url, alt, color, matched) VALUES ('frog15', 'images/frog15.png', 'Happy frog', '#3fe1f3', 'false');
INSERT INTO cards (name, image_url, alt, color, matched) VALUES ('frog16', 'images/frog16.png', 'Frog saying goodbye', '#f87676', 'false');
INSERT INTO cards (name, image_url, alt, color, matched) VALUES ('frog17', 'images/frog17.png', 'Frog sunbathing', '#f8e276', 'false');
INSERT INTO cards (name, image_url, alt, color, matched) VALUES ('frog18', 'images/frog18.png', 'Frog catching a fish', '#8afd7b', 'false');
INSERT INTO cards (name, image_url, alt, color, matched) VALUES ('frog19', 'images/frog19.png', 'Frog smelling a flower', '#43bef7', 'false');
INSERT INTO cards (name, image_url, alt, color, matched) VALUES ('frog20', 'images/frog20.png', 'Frog playing a harmonica', '#fe67ae', 'false');

SELECT * FROM cards;

SELECT COUNT(*) FROM cards;

DELETE FROM cards;






