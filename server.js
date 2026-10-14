
const express = require("express");
const cors = require("cors");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");

const app = express();

app.use(cors());
app.use(express.json());

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SECRET_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("ERRO: variáveis do Supabase não configuradas.");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// =========================
// API - TAREFAS
// =========================

app.get("/tasks", async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("tasks")
            .select("*")
            .order("date", { ascending: true });

        if (error) throw error;

        res.json(data);
    } catch (error) {
        console.error("Erro ao listar tarefas:", error.message);
        res.status(500).json({ error: "Erro ao listar tarefas." });
    }
});

app.post("/tasks", async (req, res) => {
    try {
        const { title, date, time, priority, obs } = req.body;

        if (!title || !date) {
            return res.status(400).json({
                error: "Título e data são obrigatórios."
            });
        }

        const newTask = {
            title,
            date,
            time: time || null,
            priority: priority || "normal",
            obs: obs || "",
            done: false
        };

        const { data, error } = await supabase
            .from("tasks")
            .insert(newTask)
            .select()
            .single();

        if (error) throw error;

        res.status(201).json(data);
    } catch (error) {
        console.error("Erro ao criar tarefa:", error.message);
        res.status(500).json({ error: "Erro ao criar tarefa." });
    }
});

app.put("/tasks/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const { data, error } = await supabase
            .from("tasks")
            .update(req.body)
            .eq("id", id)
            .select()
            .maybeSingle();

        if (error) throw error;

        if (!data) {
            return res.status(404).json({
                error: "Tarefa não encontrada."
            });
        }

        res.json(data);
    } catch (error) {
        console.error("Erro ao atualizar tarefa:", error.message);
        res.status(500).json({ error: "Erro ao atualizar tarefa." });
    }
});

app.delete("/tasks/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const { data, error } = await supabase
            .from("tasks")
            .delete()
            .eq("id", id)
            .select();

        if (error) throw error;

        if (!data || data.length === 0) {
            return res.status(404).json({
                error: "Tarefa não encontrada."
            });
        }

        res.json({ ok: true });
    } catch (error) {
        console.error("Erro ao excluir tarefa:", error.message);
        res.status(500).json({ error: "Erro ao excluir tarefa." });
    }
});

// =========================
// SITE
// =========================

app.use(express.static(__dirname));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "html", "index.html"));
});

// =========================
// SERVIDOR
// =========================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Servidor STANCE rodando na porta " + PORT);
});
