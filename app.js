const params = new URLSearchParams(window.location.search);
const binParam = params.get("bin");

const loading = document.getElementById("loading");
const stockCard = document.getElementById("stockCard");
const errorBox = document.getElementById("error");

const binElement = document.getElementById("bin");
const lastUpdateElement = document.getElementById("lastUpdate");
const materialList = document.getElementById("materialList");

async function loadStockCard() {
    if (!binParam) {
        showError("Parameter BIN tidak ditemukan di URL.");
        return;
    }

    try {
        // Gunakan alamat relatif terhadap folder situs GitHub Pages.
        const dataUrl = new URL("./data.json", window.location.href);
        dataUrl.searchParams.set("t", Date.now());

        const response = await fetch(dataUrl);

        if (!response.ok) {
            throw new Error(
                `HTTP ${response.status}: data.json tidak ditemukan atau tidak dapat dibaca.`
            );
        }

        const data = await response.json();

        // Periksa struktur data.
        if (!data || !data.bins) {
            throw new Error(
                'Struktur data.json tidak sesuai. Properti "bins" tidak ditemukan.'
            );
        }

        // Cocokkan BIN sebagai teks.
        const binData = data.bins[String(binParam)];

        if (!binData) {
            showError(`BIN ${binParam} tidak ditemukan dalam data.json.`);
            return;
        }

        if (!Array.isArray(binData.materials)) {
            throw new Error(
                `Data materials untuk BIN ${binParam} tidak valid.`
            );
        }

        binElement.textContent = binParam;

        if (lastUpdateElement) {
            lastUpdateElement.textContent = binData.lastUpdate || "-";
        }

        materialList.replaceChildren();

        binData.materials.forEach((item, index) => {
            const row = document.createElement("tr");

            [
                index + 1,
                item.category,
                item.material,
                item.description,
                item.qty,
                item.uom
            ].forEach(value => {
                const cell = document.createElement("td");
                cell.textContent = value ?? "";
                row.appendChild(cell);
            });

            materialList.appendChild(row);
        });

        loading.style.display = "none";
        errorBox.style.display = "none";
        stockCard.style.display = "block";

    } catch (err) {
        console.error("Stock Card error:", err);
        showError("Gagal membaca data Stock Card: " + err.message);
    }
}

function showError(message) {
    loading.style.display = "none";
    stockCard.style.display = "none";

    // Pertahankan struktur HTML error jika elemen memiliki elemen anak.
    const paragraph = errorBox.querySelector("p");

    if (paragraph) {
        paragraph.textContent = message;
    } else {
        errorBox.textContent = message;
    }

    errorBox.style.display = "block";
}

loadStockCard();
