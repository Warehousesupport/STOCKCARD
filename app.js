const params = new URLSearchParams(window.location.search);

const binParam = params.get("bin");

const loading = document.getElementById("loading");
const stockCard = document.getElementById("stockCard");
const error = document.getElementById("error");

const binElement = document.getElementById("bin");
const lastUpdateElement = document.getElementById("lastUpdate");
const materialList = document.getElementById("materialList");


async function loadStockCard() {

    if (!binParam) {
        showError("BIN tidak ditemukan.");
        return;
    }

    try {

        const response = await fetch(
            "data.json?t=" + new Date().getTime()
        );

        if (!response.ok) {
            throw new Error("data.json tidak dapat dibaca");
        }

        const data = await response.json();

        const binData = data.bins[binParam];

        if (!binData) {
            showError("BIN " + binParam + " tidak ditemukan.");
            return;
        }

        binElement.textContent = binParam;

        lastUpdateElement.textContent =
            binData.lastUpdate || "-";

        materialList.innerHTML = "";

        binData.materials.forEach((item, index) => {

            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${escapeHTML(item.category)}</td>
                <td>${escapeHTML(item.material)}</td>
                <td>${escapeHTML(item.description)}</td>
                <td>${item.qty}</td>
                <td>${escapeHTML(item.uom)}</td>
            `;

            materialList.appendChild(row);

        });

        loading.style.display = "none";
        error.style.display = "none";
        stockCard.style.display = "block";

    } catch (err) {

        console.error(err);

        showError("Gagal membaca data Stock Card.");

    }

}


function showError(message) {

    loading.style.display = "none";
    stockCard.style.display = "none";

    error.textContent = message;
    error.style.display = "block";

}


function escapeHTML(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


loadStockCard();
