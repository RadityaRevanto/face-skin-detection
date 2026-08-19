<?php $pdo = new PDO('mysql:host=127.0.0.1;dbname=skincek;port=3306', 'root', ''); $stmt = $pdo->query('SELECT * FROM skin_recommendations'); print_r($stmt->fetchAll(PDO::FETCH_ASSOC));
