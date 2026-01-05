import type { APIRoute } from "astro";
import puppeteer from "puppeteer";

export const GET: APIRoute = async ({ request }) => {

    const ua = request.headers.get('user-agent') || "";
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);

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

    const disposition = isMobile ? 'attachment' : 'inline';

    return new Response(pdfBuffer, {
        headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `${disposition}; filename="ricardo-lopez-cv.pdf"`
        }
    });
}