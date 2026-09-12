const admin = JSON.parse(
    sessionStorage.getItem("admin")
);

const token =
    sessionStorage.getItem(
        "adminToken"
    );


/* ADMIN AUTH CHECK */

if (!admin || !token) {

    window.location.href =
        "admin-login.html";

}


/* LOAD SUPPLIERS */

async function loadSuppliers() {

    try {

        const response =
            await fetch(

                "https://api.thekedar.store/api/suppliers",

                {

                    headers: {

                        "Authorization":
                            "Bearer " + token

                    }

                }

            );


        if (response.status === 401) {

            sessionStorage.removeItem(
                "admin"
            );

            sessionStorage.removeItem(
                "adminToken"
            );

            window.location.href =
                "admin-login.html";

            return;

        }


        if (!response.ok) {

            alert(
                "Unable to load suppliers"
            );

            return;

        }


        const suppliers =
            await response.json();


        const table =
            document.getElementById(
                "supplierTable"
            );


        table.innerHTML = "";


        suppliers.forEach(
            function (supplier) {

                table.innerHTML += `

                    <tr>

                        <td>
                            ${supplier.supplier_code}
                        </td>

                        <td>
                            ${
                                supplier.supplier_name ||
                                "Not Assigned"
                            }
                        </td>

                        <td>
                            ${
                                supplier.phone ||
                                "-"
                            }
                        </td>

                        <td>
                            ${
                                supplier.area ||
                                "-"
                            }
                        </td>

                        <td>
                            ${supplier.status}
                        </td>

                        <td>

                            <a href="supplier-details.html?code=${supplier.supplier_code}">

                                View

                            </a>

                        </td>

                    </tr>

                `;

            }

        );

    }

    catch (error) {

        console.log(error);

        alert(
            "Unable to load suppliers"
        );

    }

}

/* CREATE SUPPLIER */

const createSupplierForm =
    document.getElementById(
        "createSupplierForm"
    );


if (createSupplierForm) {

    createSupplierForm.addEventListener(
        "submit",
        async function (e) {

            e.preventDefault();


            const supplier = {

                supplier_name:
                    document.getElementById(
                        "newSupplierName"
                    ).value.trim(),

                phone:
                    document.getElementById(
                        "newSupplierPhone"
                    ).value.trim(),

                area:
                    document.getElementById(
                        "newSupplierArea"
                    ).value.trim(),

                address:
                    document.getElementById(
                        "newSupplierAddress"
                    ).value.trim(),

                status:
                    "ACTIVE"

            };


            try {

                const response =
                    await fetch(

                        "https://api.thekedar.store/api/suppliers",

                        {

                            method: "POST",

                            headers: {

                                "Content-Type":
                                    "application/json",

                                "Authorization":
                                    "Bearer " + token

                            },

                            body:
                                JSON.stringify(
                                    supplier
                                )

                        }

                    );


                const data =
                    await response.json();


                if (response.status === 401) {

                    sessionStorage.removeItem(
                        "admin"
                    );

                    sessionStorage.removeItem(
                        "adminToken"
                    );

                    window.location.href =
                        "admin-login.html";

                    return;

                }


                if (!response.ok) {

                    alert(
                        data.message ||
                        "Unable to create supplier"
                    );

                    return;

                }


                alert(

                    "Supplier Created Successfully\n\n" +
                    "Supplier Code: " +
                    data.supplier.supplier_code

                );


                createSupplierForm.reset();


                loadSuppliers();

            }

            catch (error) {

                console.log(error);

                alert(
                    "Server Error"
                );

            }

        }
    );

}


/* BACK BUTTON */

const backButton =
    document.getElementById(
        "backButton"
    );


if (backButton) {

    backButton.addEventListener(
        "click",
        function () {

            window.location.href =
                "admin.html";

        }
    );

}


/* LOGOUT */

const logoutButton =
    document.getElementById(
        "logoutButton"
    );


if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        function () {

            sessionStorage.removeItem(
                "admin"
            );

            sessionStorage.removeItem(
                "adminToken"
            );

            window.location.href =
                "admin-login.html";

        }
    );

}


/* INITIAL LOAD */

loadSuppliers();