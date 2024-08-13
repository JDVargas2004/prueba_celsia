document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('clienteForm');
    const inputId = document.getElementById('inputId');
    const inputNames = document.getElementById('inputNames');
    const inputLastName = document.getElementById('inputLastName');
    const typeId = document.getElementById('typeId');
    const fecha = document.getElementById('fecha');
    const inputPhone = document.getElementById('inputPhone');
    const inputEmail = document.getElementById('inputEmail');
    const service = document.getElementById('service'); // Campo nuevo
    const btnAdd = document.getElementById('btnAdd');
    const btnUpdate = document.getElementById('btnUpdate');
    const tableBody = document.getElementById('tableBody');

    let editingId = null;

   
    function showMessage(message, isError = true) {
        alert(message);
        if (isError) {
            form.reset(); 
        }
    }

    function validateForm() {
        const id = inputId.value.trim();
        const names = inputNames.value.trim();
        const lastName = inputLastName.value.trim();
        const typeIdValue = typeId.value.trim();
        const birthDate = fecha.value.trim();
        const phone = inputPhone.value.trim();
        const email = inputEmail.value.trim();
        const serviceValue = service.value.trim(); 

        const validTypes = ['CC', 'TI', 'CE', 'RC'];
        const validServices = ['Internet 200 MB', 'Internet 400 MB', 'Internet 600 MB', 'Directv Go', 'Paramount+', 'Win+'];

        if (!id || !names || !lastName || !typeIdValue || !birthDate || !phone || !email || !serviceValue) {
            showMessage('Todos los campos son obligatorios.');
            return false;
        }

        if (!validTypes.includes(typeIdValue)) {
            showMessage('Tipo de Identificación inválido. Use CC, TI, CE o RC.');
            return false;
        }

        if (!validServices.includes(serviceValue)) {
            showMessage('Servicio inválido. Use uno de los valores permitidos.');
            return false;
        }

        return true;
    }

  
    function loadTableData() {
        tableBody.innerHTML = '';
        const clientes = JSON.parse(localStorage.getItem('clientes')) || [];
        clientes.forEach(cliente => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${cliente.identificacion}</td>
                <td>${cliente.nombres}</td>
                <td>${cliente.apellidos}</td>
                <td>${cliente.tipoIdentificacion}</td>
                <td>${cliente.fechaNacimiento}</td>
                <td>${cliente.numeroCelular}</td>
                <td>${cliente.correoElectronico}</td>
                <td>${cliente.servicio}</td> <!-- Campo nuevo -->
                <td>
                    <button class="btn btn-secondary btn-sm" onclick="editCliente('${cliente.identificacion}')">Editar</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteCliente('${cliente.identificacion}')">Eliminar</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }

    function saveToLocalStorage(clientes) {
        localStorage.setItem('clientes', JSON.stringify(clientes));
        loadTableData();
    }

    function clearForm() {
        inputId.value = '';
        inputNames.value = '';
        inputLastName.value = '';
        typeId.value = '';
        fecha.value = '';
        inputPhone.value = '';
        inputEmail.value = '';
        service.value = ''; 
        btnUpdate.disabled = true;
        btnAdd.disabled = false;
        editingId = null;
    }

    window.editCliente = function(id) {
        const clientes = JSON.parse(localStorage.getItem('clientes')) || [];
        const cliente = clientes.find(c => c.identificacion === id);
        if (cliente) {
            inputId.value = cliente.identificacion;
            inputNames.value = cliente.nombres;
            inputLastName.value = cliente.apellidos;
            typeId.value = cliente.tipoIdentificacion;
            fecha.value = cliente.fechaNacimiento;
            inputPhone.value = cliente.numeroCelular;
            inputEmail.value = cliente.correoElectronico;
            service.value = cliente.servicio;
            editingId = cliente.identificacion;
            btnUpdate.disabled = false;
            btnAdd.disabled = true;
        }
    }

    window.deleteCliente = function(id) {
        let clientes = JSON.parse(localStorage.getItem('clientes')) || [];
        clientes = clientes.filter(c => c.identificacion !== id);
        saveToLocalStorage(clientes);
        clearForm();
    }

    btnAdd.addEventListener('click', () => {
        if (!validateForm()) return;

        const id = inputId.value;
        const nombres = inputNames.value;
        const apellidos = inputLastName.value;
        const tipoIdentificacion = typeId.value;
        const fechaNacimiento = fecha.value;
        const numeroCelular = inputPhone.value;
        const correoElectronico = inputEmail.value;
        const servicio = service.value; 

        const clientes = JSON.parse(localStorage.getItem('clientes')) || [];
        const existingCliente = clientes.find(c => c.identificacion === id);

        if (existingCliente) {
            showMessage('El registro ya existe.');
            return;
        }

        const newCliente = {
            identificacion: id,
            nombres: nombres,
            apellidos: apellidos,
            tipoIdentificacion: tipoIdentificacion,
            fechaNacimiento: fechaNacimiento,
            numeroCelular: numeroCelular,
            correoElectronico: correoElectronico,
            servicio: servicio 
        };

        clientes.push(newCliente);
        saveToLocalStorage(clientes);
        clearForm();
    });

    btnUpdate.addEventListener('click', () => {
        if (!validateForm()) return;

        const id = inputId.value;
        const nombres = inputNames.value;
        const apellidos = inputLastName.value;
        const tipoIdentificacion = typeId.value;
        const fechaNacimiento = fecha.value;
        const numeroCelular = inputPhone.value;
        const correoElectronico = inputEmail.value;
        const servicio = service.value; 

        let clientes = JSON.parse(localStorage.getItem('clientes')) || [];
        const clienteIndex = clientes.findIndex(c => c.identificacion === editingId);

        if (clienteIndex !== -1) {
            clientes[clienteIndex] = {
                identificacion: id,
                nombres: nombres,
                apellidos: apellidos,
                tipoIdentificacion: tipoIdentificacion,
                fechaNacimiento: fechaNacimiento,
                numeroCelular: numeroCelular,
                correoElectronico: correoElectronico,
                servicio: servicio 
            };
            saveToLocalStorage(clientes);
            clearForm();
        }
    });

    loadTableData();
});
