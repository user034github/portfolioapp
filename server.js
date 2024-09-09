import { Hono } from "hono";
import { serve } from "@hono/node-server";
import fs from 'fs/promises';
import path from 'path';

const app = new Hono();

app.get("/", async (context) => {
    const filePath = path.resolve("index.html");
    console.log(`Trying to read file from: ${filePath}`);
    try {
        const html = await fs.readFile(filePath, "utf8");
        return context.text(html, 200, { "Content-Type": "text/html" });
    } catch (error) {
        console.error(`Error reading HTML file: ${error.message}`);
        return context.text(`Error reading HTML file: ${error.message}`, 500, { "Content-Type": "text/plain" });
    }
});

app.get("/prosjekter", async (context) => {
    const filePath = path.resolve("prosjekter.json");
    console.log(`Trying to read file from: ${filePath}`);
    try {
        const json = await fs.readFile(filePath, "utf8");
        return context.text(json, 200, { "Content-Type": "application/json" });
    } catch (error) {
        console.error(`Error reading JSON file: ${error.message}`);
        return context.text(`Error reading JSON file: ${error.message}`, 500, { "Content-Type": "text/plain" });
    }
});

app.post("/prosjekter", async (context) => {
    const data = await context.req.json();
    const filePath = path.resolve("prosjekter.json");

    try {
        const fileContent = await fs.readFile(filePath, "utf8");
        const prosjekter = JSON.parse(fileContent);

        prosjekter.push(data);

        await fs.writeFile(filePath, JSON.stringify(prosjekter, null, 2));

        return context.json({ message: "Prosjekt lagt til" });
    } catch (error) {
        console.error(`Error updating JSON file: ${ error.message }`);
        return context.json({ error: `Error updating JSON file: ${ error.message }` }, 500);
    }
});

serve({ port: 3000, fetch: app.fetch }, (x) => console.log(`Serveren er aktiv: ${x.port}`));
