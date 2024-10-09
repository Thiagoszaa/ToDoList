const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname)));
app.use(express.json());

const db = new sqlite3.Database('./tasks.db', (err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err.message);
    } 
});

db.run(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/tasks', (req, res) => {
    db.all('SELECT * FROM tasks', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ tasks: rows });
    });
});

app.post('/tasks', (req, res) => {
    const { title, description } = req.body;
    if (!title) {
        return res.status(400).json({ error: 'O campo título é obrigatório.' });
    }

    const query = `INSERT INTO tasks (title, description) VALUES (?, ?)`;
    db.run(query, [title, description], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({
            id: this.lastID,
            title,
            description,
            created_at: new Date().toISOString()
        });
    });
});

app.put('/tasks/:id', (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body;

    if (!title) {
        return res.status(400).json({ error: 'O campo título é obrigatório.' });
    }

    const query = `UPDATE tasks SET title = ?, description = ? WHERE id = ?`;
    db.run(query, [title, description, id], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Tarefa não encontrada.' });
        }
        res.json({ message: 'Tarefa atualizada com sucesso.' });
    });
});

app.delete('/tasks/:id', (req, res) => {
    const { id } = req.params;

    const query = `DELETE FROM tasks WHERE id = ?`;
    db.run(query, [id], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Tarefa não encontrada.' });
        }
        res.json({ message: 'Tarefa excluída com sucesso.' });
    });
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
