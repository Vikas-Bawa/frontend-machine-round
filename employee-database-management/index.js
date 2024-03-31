(async function () {
    const data = await fetch('data.json');
    const res = await data.json();

    let employees = res;

    let selectedEmployeeId = employees[0].id;
    let selectedEmployee = employees[0];

    const employeeList = document.querySelector('.employees__names--list');
    const employeeInfo = document.querySelector('.employees__single--info');

    // add employee logic
    const createEmployee = document.querySelector(".createEmployee");
    const addEmployeeModal = document.querySelector(".addEmployee");
    const addEmployeeForm = document.querySelector(".addEmployee_create");
    const editEmployee = document.querySelector(".editEmployee");
    const formHeading = document.querySelector(".form_heading");
    let isEditEmployee = false;

    createEmployee.addEventListener("click", () => {
        formHeading.innerText = "Add New Employee";
        addEmployeeModal.style.display = "flex";
        addEmployeeForm.reset();

    })

    addEmployeeModal.addEventListener("click", (e) => {
        // addEmployeeForm.reset();
        if (e.target.className === "addEmployee") {
            addEmployeeModal.style.display = "none";
        }
    })
    const dobInput = document.querySelector('.addEmployee_create--dob');
    dobInput.max = `${new Date().getFullYear() - 18}-${new Date().toISOString().slice(5, 10)}`;


    addEmployeeForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const formData = new FormData(addEmployeeForm);
        const values = [...formData.entries()];
        let empData = {};
        values.forEach((val) => {
            empData[val[0]] = val[1];
        });
        empData.age = new Date().getFullYear() - parseInt(empData.dob.slice(0, 4), 10);
        let parts = empData.dob.split('-');
        empData.dob = parts[2] + '/' + parts[1] + '/' + parts[0];
        if (isEditEmployee) {
            const editIndex = employees.findIndex(emp => emp.id === +selectedEmployeeId);
            empData.id = employees[editIndex].id;
            employees[editIndex] = empData;
        }
        else {
            empData.id = employees[employees.length - 1].id + 1;//
            empData.imageUrl = empData.imageUrl || "https://cdn-icons-png.flaticon.com/512/0/93.png";//
            employees.push(empData);//
        }
        renderEmployees();
        renderSingleEmployee();
        addEmployeeForm.reset();
        addEmployeeModal.style.display = "none";
        isEditEmployee = false;
    })

    // Edit employee
    editEmployee.addEventListener("click", () => {
        isEditEmployee = true;
        if (!employees.length) {
            alert('There are no employees to edit. Please add employees first.');
            return;
        }
        formHeading.innerText = "Edit Employee";
        addEmployeeModal.style.display = "flex";
        editEmployeeFunc();
    })

    // Edit employee function
    const editEmployeeFunc = () => {
        let names = ["firstName", "lastName", "imageUrl", "email", "contactNumber", "salary", "address", "dob"];
        names.map(name => fillValues(name));
    }

    const fillValues = (name) => {
        let inputField = document.querySelector("input[name='" + name + "']");
        if (name === "dob") {
            var parts = selectedEmployee.dob.split('/');
            // Rearrange the parts to YYYY-MM-DD format
            var isoDateString = parts[2] + '-' + parts[1] + '-' + parts[0];
            inputField.value = isoDateString;
        }
        else {
            inputField.value = selectedEmployee[name];
        }
    }
    // select employee logic
    employeeList.addEventListener('click', (e) => {
        if (e.target.tagName === "SPAN" && selectedEmployeeId !== e.target.id) {
            selectedEmployeeId = e.target.id;
            renderEmployees();
            renderSingleEmployee();
        }

        if (e.target.tagName === "I") {
            employees = employees.filter(
                (emp) => String(emp.id) !== e.target.parentNode.id
            );
            if (String(selectedEmployeeId) === e.target.parentNode.id) {
                selectedEmployeeId = employees[0]?.id || -1;
                selectedEmployee = employees[0] || {};
                renderSingleEmployee();
            }
            renderEmployees();
        }
    })



    const renderEmployees = () => {
        employeeList.innerHTML = '';
        employees.forEach((emp => {
            const employee = document.createElement("span");
            employee.classList.add("employees__names--item");

            if (parseInt(selectedEmployeeId, 10) == emp.id) {
                employee.classList.add("selected");
                selectedEmployee = emp;
            }
            employee.setAttribute("id", emp.id);
            employee.innerHTML = `${emp.firstName} ${emp.lastName} <i class="employeeDelete">❌</i>`;

            employeeList.append(employee);
        }))
    }

    // render single employee
    const renderSingleEmployee = () => {
        // deleting employee
        if (selectedEmployeeId === -1) {
            employeeInfo.innerHTML = "";
            return;
        }

        employeeInfo.innerHTML = `
        <img src="${selectedEmployee.imageUrl}" />
        <span class="employees__single--heading">
        ${selectedEmployee.firstName} ${selectedEmployee.lastName}
        </span>
        <span>${selectedEmployee.address}</span>
        <span>${selectedEmployee.email}</span>
        <span>${selectedEmployee.contactNumber}</span>
        <span>DOB - ${selectedEmployee.dob}</span>
        `;
    }

    // if (selectedEmployee)
    renderSingleEmployee();
    renderEmployees();

})();