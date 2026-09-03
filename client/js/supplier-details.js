const admin =
    JSON.parse(
        sessionStorage.getItem("admin")
    );

const token =
    sessionStorage.getItem(
        "adminToken"
    );


/* AUTH CHECK */

if (!admin || !token) {

    window.location.href =
        "admin-login.html";

}


/* GET SUPPLIER CODE FROM URL */

const params =
    new URLSearchParams(
        window.location.search
    );

const supplierCode =
    params.get("code");


if (!supplierCode) {

    alert("Supplier code missing");

    window.location.href =
        "suppliers.html";

}


/* LOAD SUPPLIER */

async function loadSupplier() {

    try {

        const response =
            await fetch(

                "http://localhost:3000/api/suppliers/"
                + supplierCode,

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
                "Unable to load supplier"
            );

            return;

        }


        const supplier =
            await response.json();


        document.getElementById(
            "supplierCode"
        ).value =
            supplier.supplier_code;

            const bookingLink =
    "http://127.0.0.1:5500/client/index.html?source="
    + encodeURIComponent(
        supplier.supplier_code
    );


document.getElementById(
    "supplierBookingLink"
).value =
    bookingLink;


        document.getElementById(
            "supplierName"
        ).value =
            supplier.supplier_name || "";


        document.getElementById(
            "phone"
        ).value =
            supplier.phone || "";


        document.getElementById(
            "area"
        ).value =
            supplier.area || "";


        document.getElementById(
            "address"
        ).value =
            supplier.address || "";


        document.getElementById(
            "status"
        ).value =
            supplier.status || "UNASSIGNED";

    }

    catch (error) {

        console.log(error);

        alert(
            "Unable to load supplier"
        );

    }

}


/* UPDATE SUPPLIER */

const form =
    document.getElementById(
        "supplierForm"
    );


form.addEventListener(
    "submit",
    async function (e) {

        e.preventDefault();


        const supplier = {

            supplier_name:
                document.getElementById(
                    "supplierName"
                ).value.trim(),

            phone:
                document.getElementById(
                    "phone"
                ).value.trim(),

            area:
                document.getElementById(
                    "area"
                ).value.trim(),

            address:
                document.getElementById(
                    "address"
                ).value.trim(),

            status:
                document.getElementById(
                    "status"
                ).value

        };


        try {

            const response =
                await fetch(

                    "http://localhost:3000/api/suppliers/"
                    + supplierCode,

                    {

                        method: "PATCH",

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


            if (response.ok) {

                alert(
                    "Supplier Updated Successfully"
                );

                loadSupplier();

                return;

            }


            alert(

                data.message ||
                "Unable to update supplier"

            );

        }

        catch (error) {

            console.log(error);

            alert(
                "Server Error"
            );

        }

    }
);


/* BACK */

document.getElementById(
    "backButton"
).addEventListener(
    "click",
    function () {

        window.location.href =
            "suppliers.html";

    }
);



/* VIEW SUPPLIER BOOKINGS */

const viewBookingsButton =
    document.getElementById(
        "viewBookingsButton"
    );


if (viewBookingsButton) {

    viewBookingsButton.addEventListener(
        "click",
        function () {

            window.location.href =
                "admin.html?source=" +
                encodeURIComponent(
                    supplierCode
                );

        }
    );

}

/* LOGOUT */

document.getElementById(
    "logoutButton"
).addEventListener(
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

async function loadSupplierBookings() {

    try {

        const response =
            await fetch(

                "http://localhost:3000/api/bookings",

                {

                    headers: {

                        "Authorization":
                            "Bearer " + token

                    }

                }

            );


        if (!response.ok) {

            return;

        }


        const bookings =
            await response.json();


        const supplierBookings =
            bookings.filter(
                function (booking) {

                    return (
                        booking.source_code ===
                        supplierCode
                    );

                }
            );


        document.getElementById(
            "bookingCount"
        ).textContent =
            supplierBookings.length;

    }

    catch (error) {

        console.log(error);

    }

}

const copyBookingLinkButton =
    document.getElementById(
        "copyBookingLinkButton"
    );


if (copyBookingLinkButton) {

    copyBookingLinkButton.addEventListener(
        "click",
        async function () {

            const bookingLink =
                document.getElementById(
                    "supplierBookingLink"
                ).value;


            try {

                await navigator.clipboard.writeText(
                    bookingLink
                );


                alert(
                    "Supplier booking link copied"
                );

            }

            catch (error) {

                console.log(error);

                alert(
                    "Unable to copy booking link"
                );

            }

        }
    );

}

const shareWhatsAppButton =
    document.getElementById(
        "shareWhatsAppButton"
    );


if (shareWhatsAppButton) {

    shareWhatsAppButton.addEventListener(
        "click",
        function () {

            const bookingLink =
                document.getElementById(
                    "supplierBookingLink"
                ).value;


            const message =
                "Here is your The Thekedar Store booking link. "
                +
                "Please share this link with customers:\n\n"
                +
                bookingLink;


            const whatsappURL =
                "https://wa.me/?text="
                +
                encodeURIComponent(
                    message
                );


            window.open(
                whatsappURL,
                "_blank"
            );

        }
    );

}

/* INITIAL LOAD */

loadSupplier();

loadSupplierBookings();