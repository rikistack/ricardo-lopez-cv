import type { APIRoute } from "astro";
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";

export const GET: APIRoute = async ({ request }) => {
    const ua = request.headers.get("user-agent") || "";
    const isMobile = /Android|iPhone|iPad|iPod/i.test(ua);

    const browser = await puppeteer.launch({
        args: chromium.args,
        executablePath: await chromium.executablePath(),
        headless: true,
    });

    const page = await browser.newPage();

    const url = new URL(request.url);
    url.pathname = "/";

    await page.goto(url.toString(), { waitUntil: "networkidle0" });

    const pdf = await page.pdf({
        format: "A4",
        printBackground: true,
    });

    await browser.close();

    const pdfBuffer = Buffer.from(pdf);

    return new Response(pdfBuffer, {
        headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": `${isMobile ? "attachment" : "inline"}; filename="ricardo-lopez-cv.pdf"`,
        },
    });
};
