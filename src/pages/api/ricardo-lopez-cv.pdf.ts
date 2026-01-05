import type { APIRoute } from "astro";
import puppeteer from "puppeteer";

export const GET: APIRoute = async ({ request }) => {
    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    const url = new URL(request.url);
    url.pathname = '/';
    await page.goto(url.toString(), {
        waitUntil: 'networkidle0'
    })

    const pdf = await page.pdf({
        format: 'a4',
        printBackground: true
    });

    await browser.close();

    const pdfBuffer = Buffer.from(pdf);

    return new Response(pdfBuffer, {
        headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename="ricardo-lopez-cv.pdf"'
        }
    });
}