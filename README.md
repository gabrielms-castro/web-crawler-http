# Web Crawler in JavaScript

## About
This project is a Single-Domain Web Crawler integrated with Supabase.
It crawls a website starting from a base URL, fetching linked URLs recursively.

The crawler performs two main tasks:
<br>
1) **Store HTML snapshots**: Saves the raw HTML into Supabase Storage for further parsing by a Parser Worker in a **serverless application**
2) **Discover new URLs**: Extracts and enqueues new links to crawl recursively with `crawlPage()`. Each discovered URL is saved into the Supabase DB, along with a direct reference to the raw HTML stored in blob storage.

## Tech Stack
* **JavaScript (Node.js)** - Runs the **Web Crawler** (*planned refactor to TypeScript*)
* **PostgreSQL(via Supabase DB)** - Persists URLs metadata in the `urls_metada` table
* **AWS S3 (via Supabase Storage)** - Stores raw HTML snapshots and then parses it to plain text
* **Serverless (via Supabase Edge Functions)** -  runs the **Parser Worker** (responsible for text extraction)
* **Queues (RabbitMQ)** - TO BE IMPLEMENTED

## High-Level Design
![Crawler Design](./documentation/BAS%20Web%20Crawler.png "Crawler Design")

## Instalation
1. Install all dependencies:
```
npm install
``` 

2. Put your Supabase variables into an `.env` in the `./` (See the required variables at **[`config.js`](./src/supabase/config.js)**)

3. Run the Crawler:
```
npm run start
```
