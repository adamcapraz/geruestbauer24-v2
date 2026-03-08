/**
 * IndexNow — Bing ve Yandex'e URL değişikliklerini proaktif bildirir.
 *
 * Kurulum:
 * 1. Bir UUID oluşturun: https://www.uuidgenerator.net/
 * 2. .env.local'a ekleyin: INDEXNOW_KEY=uuid-buraya
 * 3. public/ klasörüne {uuid}.txt dosyası oluşturun, içine sadece UUID yazın
 */

const INDEXNOW_KEY = process.env.INDEXNOW_KEY
const BASE_URL = "https://geruestbauer24.eu"

export async function submitToIndexNow(urls: string[]): Promise<void> {
  if (!INDEXNOW_KEY || urls.length === 0) return

  const validUrls = urls
    .filter((url) => url.startsWith("https://"))
    .slice(0, 10000) // IndexNow limiti

  if (validUrls.length === 0) return

  try {
    // Gönder ve unut — await yok, ana akışı bloklamaz
    fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        host: "geruestbauer24.eu",
        key: INDEXNOW_KEY,
        keyLocation: `${BASE_URL}/${INDEXNOW_KEY}.txt`,
        urlList: validUrls,
      }),
    }).catch(() => {
      // Sessizce başarısız ol — SEO yardımcısı, kritik değil
    })
  } catch {
    // Ana akışı etkileme
  }
}

/**
 * Tek bir URL gönder (yeni firma veya blog yazısı eklendiğinde)
 */
export function submitUrlToIndexNow(url: string): void {
  submitToIndexNow([url])
}