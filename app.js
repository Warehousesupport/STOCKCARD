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
        showError();
        return;
    }

    try {

        const response = await fetch("data.json");

        if (!response.ok) {
            throw new Error("Failed to load data");
        }

        const data = await response.json();

        const binData = data[binParam];

        if (!binData) {
            showError();
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
                <td>${item.category}</td>
                <td>${item.material}</td>
                <td>${item.description}</td>
                <td>${item.qty}</td>
                <td>${item.uom}</td>
            `;

            materialList.appendChild(row);

        });

        loading.style.display = "none";
        stockCard.style.display = "block";

    } catch (err) {

        console.error(err);

        showError();

    }
}


function showError() {

    loading.style.display = "none";
    stockCard.style.display = "none";
    error.style.display = "block";

}


loadStockCard();
