CREATE TABLE users (
  id INT NOT NULL AUTO_INCREMENT,     
  nome VARCHAR(100) NOT NULL,        
  email VARCHAR(100) NOT NULL,       
  senha VARCHAR(255) NOT NULL,       
  cpf BIGINT UNIQUE DEFAULT NULL,    
  telefone VARCHAR(20) DEFAULT NULL, 
  ativo TINYINT(1) NOT NULL DEFAULT '1', 
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, 
  PRIMARY KEY (id)
);


CREATE TABLE enderecos (
  id_end INT NOT NULL AUTO_INCREMENT,
  usuario_id INT NOT NULL,       
  rua VARCHAR(255) NOT NULL,     
  numero VARCHAR(10) NOT NULL,    
  complemento VARCHAR(50) NULL,   
  bairro VARCHAR(100) NOT NULL,   
  cidade VARCHAR(100) NOT NULL,   
  estado VARCHAR(2) NOT NULL,     
  cep VARCHAR(10) NOT NULL,       
  PRIMARY KEY (id_end),               
  FOREIGN KEY (usuario_id) REFERENCES users(id) ON DELETE CASCADE
);


CREATE TABLE restaurantes (
  id_res INT NOT NULL AUTO_INCREMENT,      
  nome VARCHAR(100) NOT NULL,          
  endereco_id INT NOT NULL,            
  usuario_id INT NOT NULL,             
  cnpj BIGINT NOT NULL UNIQUE,         
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,  
  PRIMARY KEY (id_res),                    
  FOREIGN KEY (usuario_id) REFERENCES users(id) ON DELETE CASCADE,  
  FOREIGN KEY (endereco_id) REFERENCES enderecos(id_end) ON DELETE CASCADE  
);


CREATE TABLE produtos (
  id_pro INT NOT NULL AUTO_INCREMENT,
  nome VARCHAR(255) NOT NULL,
  descricao TEXT NOT NULL,
  preco DECIMAL(10, 2) NOT NULL,
  imagem_url VARCHAR(255) NULL,
  restaurante_id INT NOT NULL,
  ativo TINYINT(1) NOT NULL DEFAULT 1,
  categoria VARCHAR(100) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,  
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, 
  PRIMARY KEY (id_pro),
  FOREIGN KEY (restaurante_id) REFERENCES restaurantes(id_res) ON DELETE CASCADE
);

INSERT INTO users (nome, email, senha, cpf, telefone) VALUES
('Carlos Eduardo', 'carlosKing@gmail.com', 'CE2025', 12345678901, '11987654321'),
('Ana Souza', 'ana@gmail.com', 'AN2025', 23456789012, '11987654322'),
('Pedro Santos', 'pedro@gmail.com', 'PS2025', 34567890123, '11987654323'),
('Mariana Lima', 'mariana@gmail.com', 'marilima2025', 45678901234, '11987654324'),
('Lucas Oliveira', 'lucas@hotmail.com', 'ls2025', 56789012345, '11987654325'),
('Juliana Mendes', 'juliana@hotmail.com', 'juu2025', 67890123456, '11987654326'),
('Rafael Costa', 'rafael@gmail.com', 'rafa123', 78901234567, '11987654327'),
('Fernanda Ribeiro', 'fernanda@hotmail.com', 'senha123', 89012345678, '11987654328'),
('Gustavo Rocha', 'gustavo@hotmail.com', 'gugu2025', 90123456789, '11987654329'),
('Patrícia Almeida', 'patricia@hotmail.com', 'patricia23', 11223344556, '11987654330');


INSERT INTO enderecos (usuario_id, rua, numero, complemento, bairro, cidade, estado, cep) VALUES
(1, 'Rua das Flores', '123', 'Apto 101', 'Centro', 'São Paulo', 'SP', '01010-000'),
(2, 'Av. Paulista', '456', NULL, 'Bela Vista', 'São Paulo', 'SP', '01310-000'),
(3, 'Rua Augusta', '789', 'Fundos', 'Consolação', 'São Paulo', 'SP', '01410-000'),
(4, 'Av. Brasil', '321', NULL, 'Jardins', 'São Paulo', 'SP', '01510-000'),
(5, 'Rua Haddock Lobo', '654', NULL, 'Cerqueira César', 'São Paulo', 'SP', '01610-000'),
(6, 'Av. Rebouças', '987', 'Sala 05', 'Pinheiros', 'São Paulo', 'SP', '01710-000'),
(7, 'Rua Oscar Freire', '159', NULL, 'Jardins', 'São Paulo', 'SP', '01810-000'),
(8, 'Av. Faria Lima', '753', NULL, 'Itaim Bibi', 'São Paulo', 'SP', '01910-000'),
(9, 'Rua dos Pinheiros', '852', NULL, 'Pinheiros', 'São Paulo', 'SP', '02010-000'),
(10, 'Av. Ibirapuera', '951', 'Loja A', 'Moema', 'São Paulo', 'SP', '02110-000');


INSERT INTO restaurantes (nome, endereco_id, usuario_id, cnpj) VALUES
('Pizza Express', 1, 1, 10000000000100),
('Burger House', 2, 2, 10000000000200),
('Sushi Place', 3, 3, 10000000000300),
('Salad Fit', 4, 4, 10000000000400),
('Churrascaria Grill', 5, 5, 10000000000500),
('Doce Amor', 6, 6, 10000000000600),
('Lanche Rápido', 7, 7, 10000000000700),
('Café Gourmet', 8, 8, 10000000000800),
('Pastelaria Central', 9, 9, 10000000000900),
('Poke Tropical', 10, 10, 10000000001000);



INSERT INTO produtos (nome, descricao, preco, imagem_url, restaurante_id, ativo, categoria) VALUES
('Pizza Margherita', 'Pizza com molho de tomate, mussarela e manjericão.', 39.90, 'https://example.com/pizza.jpg', 1, 1, 'Pizza'),
('Hambúrguer Clássico', 'Pão brioche, hambúrguer 150g, queijo cheddar.', 29.90, 'https://example.com/hamburguer.jpg', 2, 1, 'Lanches'),
('Sushi Combo', '12 unidades de sushi variados com molho shoyu.', 54.90, 'https://example.com/sushi.jpg', 3, 1, 'Japonesa'),
('Salada Caesar', 'Alface, frango grelhado, queijo parmesão e molho Caesar.', 25.00, 'https://example.com/salada.jpg', 4, 1, 'Saladas'),
('Churrasco Misto', 'Picanha, linguiça, frango e acompanhamentos.', 69.90, 'https://example.com/churrasco.jpg', 5, 1, 'Carnes'),
('Torta de Limão', 'Torta de limão com base crocante e merengue.', 22.90, 'https://example.com/torta.jpg', 6, 1, 'Sobremesas'),
('Coxinha de Frango', 'Massa crocante recheada com frango desfiado e catupiry.', 7.50, 'https://example.com/coxinha.jpg', 7, 1, 'Salgados'),
('Café Expresso', 'Café expresso curto e encorpado.', 8.50, 'https://example.com/cafe.jpg', 8, 1, 'Bebidas'),
('Pastel de Carne', 'Pastel crocante recheado com carne moída temperada.', 6.50, 'https://example.com/pastel.jpg', 9, 1, 'Salgados'),
('Poke de Salmão', 'Tigela com arroz, salmão fresco, molho especial e gergelim.', 42.00, 'https://example.com/poke.jpg', 10, 1, 'Saudável');
 
