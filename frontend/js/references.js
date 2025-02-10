document.addEventListener("DOMContentLoaded", function () {
    const referenceForm = document.getElementById("reference-form");
    const referenceInput = document.getElementById("client-reference");
    const referenceList = document.createElement("ul"); // Lista para mostrar referencias previas
    referenceList.classList.add("list-group", "mt-3");

    // Obtener referencias previas desde localStorage
    function loadReferences() {
        const references = JSON.parse(localStorage.getItem("client-references")) || [];
        referenceList.innerHTML = ""; // Limpiar antes de recargar

        references.forEach((ref, index) => {
            const listItem = document.createElement("li");
            listItem.classList.add("list-group-item");
            listItem.textContent = ref;

            // Botón para eliminar referencia
            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.classList.add("btn", "btn-danger", "btn-sm", "ms-2");
            deleteButton.addEventListener("click", function () {
                deleteReference(index);
            });

            listItem.appendChild(deleteButton);
            referenceList.appendChild(listItem);
        });
    }

    // Función para eliminar referencia por índice
    function deleteReference(index) {
        let references = JSON.parse(localStorage.getItem("client-references")) || [];
        references.splice(index, 1);
        localStorage.setItem("client-references", JSON.stringify(references));
        loadReferences();
    }

    // Evento de envío del formulario
    referenceForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const referenceText = referenceInput.value.trim();

        if (referenceText === "") {
            alert("Reference cannot be empty.");
            return;
        }

        // Guardar en localStorage
        let references = JSON.parse(localStorage.getItem("client-references")) || [];
        references.push(referenceText);
        localStorage.setItem("client-references", JSON.stringify(references));

        // Limpiar input y recargar referencias
        referenceInput.value = "";
        loadReferences();
    });

    // Agregar la lista de referencias debajo del formulario
    referenceForm.parentElement.appendChild(referenceList);

    // Cargar referencias al iniciar
    loadReferences();
});
