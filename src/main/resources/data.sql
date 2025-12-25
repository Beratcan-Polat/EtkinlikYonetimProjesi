INSERT IGNORE INTO kullanici 
(kullanici_adi, sifre, ad_soyad, rol, eposta, telefon)
VALUES
('admin', '{bcrypt}$2a$10$9OOUwh.q35KKjfMoKGDuiu7hKghGFfIUCvHNak9g9Xl4spPmolI/C', 'Sistem Yöneticisi', 'ADMIN', 'admin@system.com', '5551112233'),
('organizator1', '{bcrypt}$2a$10$HYgyK53vLJjgV1Fz4j1JqeRRWcUXhJ.TbH0hV/iNsOCWwNJ8/rp6i', 'Ahmet Organizatör', 'ORGANIZATOR', 'ahmet@etkinlik.com', '5552223344'),
('katilimci1', '{bcrypt}$2a$10$HYgyK53vLJjgV1Fz4j1JqeRRWcUXhJ.TbH0hV/iNsOCWwNJ8/rp6i', 'Mehmet Katılımcı', 'KATILIMCI', 'mehmet@posta.com', '5553334455');
